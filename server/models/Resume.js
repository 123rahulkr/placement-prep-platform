const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    s3Key: {
      type: String,
      required: true,
    },

    targetRole: {
      type: String,
      default: "Software Engineer",
    },

    analysis: {
      atsScore: { type: Number },
      scoreBreakdown: {
        formatting: Number,
        keywords: Number,
        experience: Number,
        skills: Number,
      },
      presentKeywords: [String],
      missingKeywords: [String],
      strengths: [String],
      improvements: [String],
      recruiterFeedback: String,
      overallVerdict: String,
    },

    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", resumeSchema);
