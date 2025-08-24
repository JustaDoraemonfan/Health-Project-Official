import mongoose from "mongoose";

const frontlineWorkerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    role: { type: String, default: "frontlineWorker" },
  },
  { timestamps: true }
);

const FrontlineWorker = mongoose.model(
  "FrontlineWorker",
  frontlineWorkerSchema
);
export default FrontlineWorker;
