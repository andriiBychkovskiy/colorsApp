import express from "express";
import Palette from "../models/Palette.js";

const router = express.Router();

// GET all palettes
router.get("/", async (req, res) => {
  try {
    const palettes = await Palette.find();
    res.json(palettes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET palette by ID
router.get("/:id", async (req, res) => {
  try {
    const palette = await Palette.findOne({ id: req.params.id });
    if (!palette) {
      return res.status(404).json({ error: "Palette not found" });
    }
    res.json(palette);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new palette
router.post("/", async (req, res) => {
  try {
    const palette = new Palette(req.body);
    await palette.save();
    res.status(201).json(palette);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Palette with this ID already exists" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// PUT update palette
router.put("/:id", async (req, res) => {
  try {
    const palette = await Palette.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!palette) {
      return res.status(404).json({ error: "Palette not found" });
    }
    res.json(palette);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE palette
router.delete("/:id", async (req, res) => {
  try {
    const palette = await Palette.findOneAndDelete({ id: req.params.id });
    if (!palette) {
      return res.status(404).json({ error: "Palette not found" });
    }
    res.json({ message: "Palette deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
