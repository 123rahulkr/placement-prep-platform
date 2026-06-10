const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "solved", "skipped"],
      default: "not_started",
    },

    attempts: { type: Number, default: 0 },

    solvedAt: { type: Date },

    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

userProgressSchema.index({ user: 1, problem: 1 }, { unique: true });

module.exports = mongoose.model("UserProgress", userProgressSchema);
