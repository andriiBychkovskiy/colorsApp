import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Image from "../models/Image.js";
import Palette from "../models/Palette.js";
import Progress from "../models/Progress.js";

dotenv.config();

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Read JSON data
    const dbJsonPath = path.join(process.cwd(), "../react/db.json");
    const jsonData = JSON.parse(fs.readFileSync(dbJsonPath, "utf8"));

    // Clear existing data
    await User.deleteMany({});
    await Image.deleteMany({});
    await Palette.deleteMany({});
    await Progress.deleteMany({});

    // Migrate users
    if (jsonData.users) {
      await User.insertMany(jsonData.users);
      console.log(`Migrated ${jsonData.users.length} users`);
    }

    // Migrate images
    if (jsonData.images) {
      await Image.insertMany(jsonData.images);
      console.log(`Migrated ${jsonData.images.length} images`);
    }

    // Migrate palettes
    if (jsonData.palettes) {
      await Palette.insertMany(jsonData.palettes);
      console.log(`Migrated ${jsonData.palettes.length} palettes`);
    }

    // Migrate progress
    if (jsonData.progress) {
      // Filter out progress entries with empty userId or svgId
      const validProgress = jsonData.progress.filter(
        (progress) => progress.userId && progress.svgId
      );

      if (validProgress.length > 0) {
        await Progress.insertMany(validProgress);
        console.log(`Migrated ${validProgress.length} progress entries`);
      }

      const invalidCount = jsonData.progress.length - validProgress.length;
      if (invalidCount > 0) {
        console.log(
          `Skipped ${invalidCount} invalid progress entries (missing userId or svgId)`
        );
      }
    }

    console.log("Data migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateData();
