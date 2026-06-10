const Problem = require("../models/Problem");
const UserProgress = require("../models/UserProgress");
const { findProblemsByCompany } = require("../services/embeddingService");
const redis = require("../config/redis");

// GET /api/dsa/roadmap?company=Amazon
const getRoadmap = async (req, res) => {
  try {
    const { company = "Amazon" } = req.query;
    const userId = req.user._id;

    const cacheKey = `roadmap:${company.toLowerCase()}`;

    let matchedProblems = null;

    // check Redis cache first
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log(`Cache HIT for ${company} roadmap`);
      matchedProblems = JSON.parse(cached);
    } else {
      console.log(`Cache MISS for ${company} — querying database...`);

      // fetch all problems from MongoDB
      const allProblems = await Problem.find({});

      // find problems matching this company using tag filtering
      matchedProblems = findProblemsByCompany(company, allProblems);

      // cache for 1 hour
      await redis.set(cacheKey, JSON.stringify(matchedProblems), "EX", 3600);

      console.log(`Cached ${company} roadmap for 1 hour`);
    }

    // always fetch user progress fresh
    const problemIds = matchedProblems.map((p) => p._id);

    const progressRecords = await UserProgress.find({
      user: userId,
      problem: { $in: problemIds },
    });

    const progressMap = {};
    progressRecords.forEach((record) => {
      progressMap[record.problem.toString()] = record;
    });

    const roadmap = matchedProblems.map((problem) => ({
      ...problem,
      progress: progressMap[problem._id.toString()] || {
        status: "not_started",
      },
    }));

    const grouped = {
      Easy: roadmap.filter((p) => p.difficulty === "Easy"),
      Medium: roadmap.filter((p) => p.difficulty === "Medium"),
      Hard: roadmap.filter((p) => p.difficulty === "Hard"),
    };

    const stats = {
      total: roadmap.length,
      solved: roadmap.filter((p) => p.progress.status === "solved").length,
      inProgress: roadmap.filter((p) => p.progress.status === "in_progress")
        .length,
      notStarted: roadmap.filter((p) => p.progress.status === "not_started")
        .length,
    };

    res.json({ roadmap: grouped, stats, company });
  } catch (err) {
    console.error("Roadmap error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/dsa/progress/:problemId
const updateProgress = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user._id;

    const validStatuses = ["not_started", "in_progress", "solved", "skipped"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const progress = await UserProgress.findOneAndUpdate(
      { user: userId, problem: problemId },
      {
        status,
        notes,
        $inc: { attempts: 1 },
        ...(status === "solved" && { solvedAt: new Date() }),
      },
      { upsert: true, new: true },
    );

    res.json({ progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dsa/stats
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const allProgress = await UserProgress.find({ user: userId }).populate(
      "problem",
      "title difficulty topic",
    );

    const stats = {
      totalSolved: allProgress.filter((p) => p.status === "solved").length,
      byDifficulty: {
        Easy: allProgress.filter(
          (p) => p.status === "solved" && p.problem?.difficulty === "Easy",
        ).length,
        Medium: allProgress.filter(
          (p) => p.status === "solved" && p.problem?.difficulty === "Medium",
        ).length,
        Hard: allProgress.filter(
          (p) => p.status === "solved" && p.problem?.difficulty === "Hard",
        ).length,
      },
      byTopic: {},
      recentlySolved: allProgress
        .filter((p) => p.status === "solved" && p.solvedAt)
        .sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt))
        .slice(0, 5)
        .map((p) => ({
          title: p.problem?.title,
          difficulty: p.problem?.difficulty,
          solvedAt: p.solvedAt,
        })),
    };

    allProgress
      .filter((p) => p.status === "solved" && p.problem?.topic)
      .forEach((p) => {
        const topic = p.problem.topic;
        stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
      });

    res.json({ stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRoadmap, updateProgress, getStats };
