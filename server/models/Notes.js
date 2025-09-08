import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "General Advice",
        "Follow-up",
        "Medication",
        "Lifestyle/Diet",
        "Lab Result",
      ],
      default: "General Advice",
    },
    priority: {
      type: String,
      enum: ["Normal", "Important", "Urgent"],
      default: "Normal",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    acknowledged: {
      type: Boolean, // patient pressed "understood"
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
