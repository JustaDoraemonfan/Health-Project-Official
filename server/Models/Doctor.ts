import { Schema, model, type HydratedDocument, Types } from "mongoose";
import { nowInIST } from "../utils/dateUtils.js";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected"
  | "suspended";

export type VerificationAction =
  | "applied"
  | "approved"
  | "rejected"
  | "resubmitted"
  | "suspended";

export interface Availability {
  day: string;
  slots: string[];
}

export interface VerificationEvidence {
  nmcCertificate?: string;
  mbbsCertificate?: string;
  internshipCertificate?: string;
  aadharCard?: string;

  // Legacy
  idDocument?: string;
  licenseDocument?: string;
  selfie?: string;
}

export interface VerificationAudit {
  action: VerificationAction;

  by: Types.ObjectId;

  at: Date;

  notes?: string;
}

export interface Verification {
  status: "unverified" | "pending" | "verified" | "rejected" | "suspended";

  appliedAt?: Date;
  verifiedAt?: Date;
  reviewedAt?: Date;

  reviewedBy?: Types.ObjectId;
  verifiedBy?: Types.ObjectId;

  reviewNotes?: string;
  rejectionReason?: string;

  attempts: number;

  nmcRegistrationNumber?: string;

  evidence: VerificationEvidence;

  auditTrail: VerificationAudit[];
}

export interface IDoctor {
  userId: Types.ObjectId;

  profilePhoto: string;
  profilePhotoKey: string;

  specialization: string;

  experience: number;

  location?: string;

  isAvailable: "Available" | "Busy" | "In Surgery" | "On Break" | "Offline";

  rating: number;
  reviewCount: number;

  education?: string;

  languages: string[];

  consultationFee: number;

  nextAvailable?: string;

  certifications: string[];

  about?: string;

  phone?: string;

  profileUpdated: boolean;

  availability: Availability[];

  patients: Types.ObjectId[];

  appointments: Types.ObjectId[];

  verification: Verification;

  createdAt?: Date;

  updatedAt?: Date;
}

export type DoctorDocument = HydratedDocument<IDoctor>;

const doctorSchema = new Schema<IDoctor>(
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

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
    },

    isAvailable: {
      type: String,
      enum: ["Available", "Busy", "In Surgery", "On Break", "Offline"],
      default: "Available",
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    education: {
      type: String,
    },

    languages: [
      {
        type: String,
      },
    ],

    consultationFee: {
      type: Number,
      default: 0,
    },

    nextAvailable: {
      type: String,
    },

    certifications: [
      {
        type: String,
      },
    ],

    about: {
      type: String,
    },

    phone: {
      type: String,
    },

    profileUpdated: {
      type: Boolean,
      default: false,
    },

    availability: [
      {
        day: {
          type: String,
        },
        slots: [
          {
            type: String,
          },
        ],
      },
    ],

    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],

    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],

    verification: {
      status: {
        type: String,
        enum: ["unverified", "pending", "verified", "rejected", "suspended"],
        default: "unverified",
      },

      appliedAt: {
        type: Date,
      },

      verifiedAt: {
        type: Date,
      },

      reviewedAt: {
        type: Date,
      },

      reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
      },

      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
      },

      reviewNotes: {
        type: String,
      },

      rejectionReason: {
        type: String,
      },

      attempts: {
        type: Number,
        default: 0,
      },

      nmcRegistrationNumber: {
        type: String,
      },

      evidence: {
        nmcCertificate: {
          type: String,
        },

        mbbsCertificate: {
          type: String,
        },

        internshipCertificate: {
          type: String,
        },

        aadharCard: {
          type: String,
        },

        // Legacy
        idDocument: {
          type: String,
        },

        licenseDocument: {
          type: String,
        },

        selfie: {
          type: String,
        },
      },

      auditTrail: [
        {
          action: {
            type: String,
            enum: [
              "applied",
              "approved",
              "rejected",
              "resubmitted",
              "suspended",
            ],
          },

          by: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },

          at: {
            type: Date,
            default: nowInIST,
          },

          notes: {
            type: String,
          },
        },
      ],
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

doctorSchema.pre("save", function (next) {
  const now = nowInIST();

  this.updatedAt = now;

  if (this.isNew) {
    this.createdAt = now;
  }

  next();
});

doctorSchema.pre("findOneAndUpdate", function (next) {
  this.set({
    updatedAt: nowInIST(),
  });

  next();
});

doctorSchema.index({ "verification.status": 1 });

doctorSchema.index({
  "verification.status": 1,
  "verification.appliedAt": -1,
});

doctorSchema.index({
  specialization: 1,
  isAvailable: 1,
});

doctorSchema.index({
  location: 1,
});

const Doctor = model<IDoctor>("Doctor", doctorSchema);

export default Doctor;
