import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      default: () => Date.now().toString(),
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    svgId: {
      type: String,
      required: true,
      ref: "Image",
    },
    layers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for userId and svgId
progressSchema.index({ userId: 1, svgId: 1 });

export default mongoose.model("Progress", progressSchema);
