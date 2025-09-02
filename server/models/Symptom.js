import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // reference Patient model
      required: true,
    },
    description: {
      type: String,
      required: [true, "Symptom description is required"],
      trim: true,
    },
    severity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe"],
      required: [true, "Severity is required"],
    },
    onsetDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "neurological",
        "respiratory",
        "digestive",
        "cardiovascular",
        "musculoskeletal",
        "dermatological",
        "other",
      ],
      default: "Other",
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Symptom = mongoose.model("Symptom", symptomSchema);

export default Symptom;
