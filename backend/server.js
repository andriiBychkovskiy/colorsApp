import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/users.js";
import imageRoutes from "./routes/images.js";
import paletteRoutes from "./routes/palettes.js";
import progressRoutes from "./routes/progress.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: [
    "http://localhost:5173", // Vite dev server
    "http://localhost:5174", // Alternative Vite port
    "http://localhost:3000", // Alternative port
    "http://127.0.0.1:5173", // Alternative localhost
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use("/users", userRoutes);
app.use("/images", imageRoutes);
app.use("/palettes", paletteRoutes);
app.use("/progress", progressRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../react/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "..", "react", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("API is running..."));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
