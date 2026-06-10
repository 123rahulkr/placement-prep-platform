const express = require("express");
const {
  getRoadmap,
  updateProgress,
  getStats,
} = require("../controllers/dsaController");
const protect = require("../middleware/protect");

const router = express.Router();

router.use(protect);

router.get("/roadmap", getRoadmap);
router.get("/stats", getStats);
router.patch("/progress/:problemId", updateProgress);

module.exports = router;
