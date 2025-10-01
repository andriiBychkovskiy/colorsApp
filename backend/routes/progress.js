import express from "express";
import Progress from "../models/Progress.js";

const router = express.Router();

// GET all progress or filter by userId
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const progress = await Progress.find(filter);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET progress by ID
router.get("/:id", async (req, res) => {
  try {
    const progress = await Progress.findOne({ id: req.params.id });
    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET progress by userId and svgId - create if not exists
router.get("/user/:userId/svg/:svgId", async (req, res) => {
  try {
    const { userId, svgId } = req.params;
    let progress = await Progress.findOne({ userId, svgId });
    
    // If no progress exists, create a new one
    if (!progress) {
      progress = new Progress({
        userId,
        svgId,
        layers: {}
      });
      await progress.save();
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new progress
router.post("/", async (req, res) => {
  try {
    const progress = new Progress(req.body);
    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Progress with this ID already exists" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// PUT update progress
router.put("/:id", async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE progress
router.delete("/:id", async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({ id: req.params.id });
    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }
    res.json({ message: "Progress deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
