const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    companies: [{ type: String }],

    leetcodeUrl: { type: String },

    hints: [{ type: String }],

    timeComplexity: { type: String },

    spaceComplexity: { type: String },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Problem", problemSchema);
