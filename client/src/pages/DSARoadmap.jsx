import { useState } from "react";
import { getRoadmap, updateProgress } from "../services/dsaService";

const companies = [
  "Amazon",
  "Google",
  "Microsoft",
  "Facebook",
  "Apple",
  "Uber",
  "Adobe",
  "Goldman Sachs",
];

const difficultyStyle = {
  Easy: "text-green-600 bg-green-50 border-green-200",
  Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Hard: "text-red-600 bg-red-50 border-red-200",
};

const statusDotColor = {
  solved: "bg-green-500",
  in_progress: "bg-yellow-400",
  skipped: "bg-gray-400",
  not_started: "bg-gray-200",
};

function ProblemCard({ problem, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const status = problem.progress?.status || "not_started";

  const handleStatusClick = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(problem._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDotColor[status]}`}
          />
          <span className="text-sm font-medium text-gray-900">
            {problem.title}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded border font-medium ${difficultyStyle[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
          <span className="text-xs text-gray-400 font-mono hidden sm:block">
            {problem.topic}
          </span>
          <span className="text-xs text-gray-400">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {problem.description}
          </p>

          <div className="flex gap-4 mb-4">
            <div>
              <span className="text-xs text-gray-400">Time: </span>
              <span className="text-xs font-mono text-gray-700">
                {problem.timeComplexity}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400">Space: </span>
              <span className="text-xs font-mono text-gray-700">
                {problem.spaceComplexity}
              </span>
            </div>
          </div>

          {problem.hints?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Hints</p>
              <ul className="space-y-1">
                {problem.hints.map((hint, i) => (
                  <li key={i} className="text-xs text-gray-500 flex gap-2">
                    <span className="text-gray-400 flex-shrink-0">—</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Asked by</p>
            <div className="flex flex-wrap gap-1">
              {problem.companies.map((c) => (
                <span
                  key={c}
                  className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-600"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {problem.leetcodeUrl && (
              <a
                href={problem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Open on LeetCode
              </a>
            )}
            <div className="flex gap-2 ml-auto">
              {["in_progress", "solved", "skipped"].map((s) => (
                <button
                  key={s}
                  disabled={updating}
                  onClick={() => handleStatusClick(s)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors disabled:opacity-50 ${
                    status === s
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white border-gray-300 text-gray-600 hover:border-gray-500"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DSARoadmap() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRoadmap = async (company) => {
    setLoading(true);
    setError("");
    setRoadmap(null);

    try {
      const data = await getRoadmap(company);
      setRoadmap(data.roadmap);
      setStats(data.stats);
    } catch (err) {
      setError("Failed to load roadmap. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    fetchRoadmap(company);
  };

  const handleStatusUpdate = async (problemId, status) => {
    try {
      await updateProgress(problemId, { status });
      if (selectedCompany) fetchRoadmap(selectedCompany);
    } catch (err) {
      console.error("Failed to update progress:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <span className="font-mono text-sm font-medium text-gray-900">
          prep.ai / dsa roadmap
        </span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">DSA Roadmap</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a target company to get a personalized problem list ranked by
            relevance using Gemini AI embeddings.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Target Company
          </p>
          <div className="flex flex-wrap gap-2">
            {companies.map((company) => (
              <button
                key={company}
                onClick={() => handleCompanySelect(company)}
                className={`text-sm px-4 py-1.5 rounded-md border transition-colors ${
                  selectedCompany === company
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-600"
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: stats.total },
              { label: "Solved", value: stats.solved },
              { label: "In Progress", value: stats.inProgress },
              { label: "Not Started", value: stats.notStarted },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-200 rounded-lg p-3 text-center"
              >
                <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-500">
              Generating your personalized roadmap...
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Running Gemini embedding similarity search
            </p>
          </div>
        )}

        {roadmap && !loading && (
          <div className="space-y-8">
            {["Easy", "Medium", "Hard"].map((difficulty) => {
              const problems = roadmap[difficulty];
              if (!problems || problems.length === 0) return null;

              const solvedCount = problems.filter(
                (p) => p.progress?.status === "solved",
              ).length;

              return (
                <div key={difficulty}>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-medium text-gray-900">
                      {difficulty}
                    </h2>
                    <span className="text-xs text-gray-400">
                      {solvedCount}/{problems.length} solved
                    </span>
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-400 rounded-full transition-all"
                        style={{
                          width: `${
                            problems.length > 0
                              ? (solvedCount / problems.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {problems.map((problem) => (
                      <ProblemCard
                        key={problem._id}
                        problem={problem}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!roadmap && !loading && !error && (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400">
              Select a company above to generate your roadmap
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
