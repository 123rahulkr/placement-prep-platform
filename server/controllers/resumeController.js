const pdfParse = require("pdf-parse");
const { uploadToS3, getSignedFileUrl } = require("../services/s3Service");
const { analyzeResume } = require("../services/geminiService");
const Resume = require("../models/Resume");

const analyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const { targetRole = "Software Engineer" } = req.body;
    const userId = req.user._id;

    console.log("Step 1: Extracting text from PDF...");
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message:
          "Could not extract text from this PDF. Make sure it is a text-based PDF and not a scanned image.",
      });
    }

    console.log("Step 2: Uploading to S3...");
    const timestamp = Date.now();
    const s3Key = `resumes/${userId}/${timestamp}-${req.file.originalname}`;
    await uploadToS3(req.file.buffer, s3Key, req.file.mimetype);

    console.log("Step 3: Analyzing with Gemini AI...");
    const analysis = await analyzeResume(resumeText, targetRole);

    console.log("Step 4: Saving to database...");
    const resume = await Resume.create({
      user: userId,
      fileName: req.file.originalname,
      s3Key,
      targetRole,
      analysis,
    });

    console.log("Analysis complete");

    res.status(201).json({
      message: "Resume analyzed successfully",
      resumeId: resume._id,
      analysis,
    });
  } catch (err) {
    console.error("Resume analysis error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-s3Key");

    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const fileUrl = await getSignedFileUrl(resume.s3Key);
    res.json({ resume, fileUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { analyze, getHistory, getOne };
