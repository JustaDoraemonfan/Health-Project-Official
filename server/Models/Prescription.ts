import { Schema, model, type HydratedDocument, Types } from "mongoose";
import { nowInIST } from "../utils/dateUtils.js";

export interface IPrescription {
  doctorId: Types.ObjectId;

  patientId: Types.ObjectId;

  originalName: string;

  mime: string;

  size: number;

  filePath: string;

  uploadedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export type PrescriptionDocument = HydratedDocument<IPrescription>;

const prescriptionSchema = new Schema<IPrescription>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    uploadedAt: {
      type: Date,
      default: nowInIST,
    },

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

prescriptionSchema.pre("save", function (next) {
  const now = nowInIST();

  this.updatedAt = now;

  if (this.isNew) {
    this.createdAt = now;
  }

  next();
});

prescriptionSchema.pre("findOneAndUpdate", function (next) {
  this.set({
    updatedAt: nowInIST(),
  });

  next();
});

prescriptionSchema.index({
  patientId: 1,
  uploadedAt: -1,
});

prescriptionSchema.index({
  doctorId: 1,
  patientId: 1,
});

const Prescription = model<IPrescription>("Prescription", prescriptionSchema);

export default Prescription;
