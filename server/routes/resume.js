const express = require("express");
const {
  analyze,
  getHistory,
  getOne,
} = require("../controllers/resumeController");
const protect = require("../middleware/protect");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router.post("/analyze", upload.single("resume"), analyze);
router.get("/history", getHistory);
router.get("/:id", getOne);

module.exports = router;
