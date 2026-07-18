import { Schema, model, type HydratedDocument, Types } from "mongoose";
import { nowInIST } from "../utils/dateUtils.js";

export interface MedicalHistory {
  condition: string;
  diagnosedDate: Date;
  status: "ongoing" | "recovered";
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: Types.ObjectId;
}

export interface Surgery {
  name: string;
  date: Date;
  hospital: string;
}

export interface Report {
  title: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  validTill: Date;
}

export interface IPatient {
  userId: Types.ObjectId;

  profilePhoto: string;
  profilePhotoKey: string;

  // Basic Information
  age?: number;
  gender?: "male" | "female" | "other";
  location?: string;
  contactNumber?: string;
  bloodGroup?: string;

  symptoms: Types.ObjectId[];

  // Medical Information
  medicalHistory: MedicalHistory[];
  allergies: string[];
  medications: Medication[];
  surgeries: Surgery[];
  reports: Report[];

  // Care Team
  assignedDoctor?: Types.ObjectId;
  emergencyContact?: EmergencyContact;

  // Insurance
  insurance?: Insurance;

  appointments: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}

export type PatientDocument = HydratedDocument<IPatient>;

const patientSchema = new Schema<IPatient>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    profilePhotoKey: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    location: {
      type: String,
    },

    contactNumber: String,

    bloodGroup: String,

    symptoms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Symptom",
      },
    ],

    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        status: {
          type: String,
          enum: ["ongoing", "recovered"],
        },
      },
    ],

    allergies: [String],

    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        prescribedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    surgeries: [
      {
        name: String,
        date: Date,
        hospital: String,
      },
    ],

    reports: [
      {
        title: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: nowInIST,
        },
      },
    ],

    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },

    insurance: {
      provider: String,
      policyNumber: String,
      validTill: Date,
    },

    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],

    createdAt: Date,

    updatedAt: Date,
  },
  {
    timestamps: false,
  },
);
patientSchema.pre("save", function (next) {
  const now = nowInIST();
  this.updatedAt = now;
  if (this.isNew) {
    this.createdAt = now;
  }
  next();
});

patientSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: nowInIST() });
  next();
});

patientSchema.index({ assignedDoctor: 1 });
patientSchema.index({ gender: 1 });
patientSchema.index({ bloodGroup: 1 });

const Patient = model<IPatient>("Patient", patientSchema);
export default Patient;
