import express from "express";
import Image from "../models/Image.js";

const router = express.Router();

// GET all images
router.get("/", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET image by ID
router.get("/:id", async (req, res) => {
  try {
    const image = await Image.findOne({ id: req.params.id });
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new image
router.post("/", async (req, res) => {
  try {
    const image = new Image(req.body);
    await image.save();
    res.status(201).json(image);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Image with this ID already exists" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// PUT update image
router.put("/:id", async (req, res) => {
  try {
    const image = await Image.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.json(image);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE image
router.delete("/:id", async (req, res) => {
  try {
    const image = await Image.findOneAndDelete({ id: req.params.id });
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
