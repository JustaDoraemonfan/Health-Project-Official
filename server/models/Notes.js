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
  { timestamps: true },
);

// --- Indexes ---
// getDoctorNotes: all notes by a doctor sorted by date
noteSchema.index({ doctorId: 1, createdAt: -1 });

// getPatientNotes: all notes for a patient sorted by date
noteSchema.index({ patientId: 1, createdAt: -1 });

// Doctor viewing notes for a specific patient (doctorId + patientId always queried together)
noteSchema.index({ doctorId: 1, patientId: 1 });

// Unread notes count/filter for a patient
noteSchema.index({ patientId: 1, isRead: 1 });

export default mongoose.model("Note", noteSchema);
