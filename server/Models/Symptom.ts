import { Schema, model, type HydratedDocument, Types } from "mongoose";
import { nowInIST } from "../utils/dateUtils.js";

export type SymptomSeverity = "Mild" | "Moderate" | "Severe";

export type SymptomCategory =
  | "neurological"
  | "respiratory"
  | "digestive"
  | "cardiovascular"
  | "musculoskeletal"
  | "dermatological"
  | "other";

export interface Attachment {
  originalName: string;
  mime: string;
  size: number;
  filePath: string;
  url?: string;
  uploadedAt: Date;
}

export interface ISymptom {
  patient: Types.ObjectId;

  description: string;

  severity: SymptomSeverity;

  onsetDate: Date;

  notes?: string;

  category: SymptomCategory;

  attachments: Attachment[];

  createdAt?: Date;
  updatedAt?: Date;
}

export type SymptomDocument = HydratedDocument<ISymptom>;

const symptomSchema = new Schema<ISymptom>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
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
      default: nowInIST,
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
      default: "other",
    },

    attachments: [
      {
        originalName: {
          type: String,
          required: true,
        },

        mime: {
          type: String,
          required: true,
        },

        size: {
          type: Number,
          required: true,
        },

        filePath: {
          type: String,
          required: true,
        },

        url: {
          type: String,
        },

        uploadedAt: {
          type: Date,
          default: nowInIST,
        },
      },
    ],

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: false,
  },
);

symptomSchema.pre("save", function (next) {
  const now = nowInIST();

  this.updatedAt = now;

  if (this.isNew) {
    this.createdAt = now;
  }

  next();
});

symptomSchema.pre("findOneAndUpdate", function (next) {
  this.set({
    updatedAt: nowInIST(),
  });

  next();
});

symptomSchema.index({
  patient: 1,
  createdAt: -1,
});

symptomSchema.index({
  patient: 1,
  severity: 1,
});

symptomSchema.index({
  patient: 1,
  category: 1,
});

const Symptom = model<ISymptom>("Symptom", symptomSchema);

export default Symptom;
