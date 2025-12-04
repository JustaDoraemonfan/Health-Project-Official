import mongoose from "mongoose";
// Assuming the path is relative to the models directory
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js";

// Helper function to get the current time in IST

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // specialization, experience, etc.
      required: true,
    },

    // Date & Time
    appointmentDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // Use IST-aware 'now' for validation
          return value >= nowInIST();
        },
        message: "Appointment date must be in the future.",
      },
    },
    appointmentTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/, // 24hr or AM/PM format
    },

    // Appointment Details
    type: {
      type: String,
      enum: ["consultation", "follow-up", "check-up", "emergency"],
      default: "consultation",
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "completed",
        "cancelled-by-patient",
        "cancelled-by-doctor",
        "no-show",
      ],
      default: "scheduled",
    },

    // NEW: A dedicated object for cancellation info
    cancellationDetails: {
      cancelledBy: {
        type: String, // 'patient', 'doctor', 'admin'
        enum: ["patient", "doctor", "admin"],
      },
      cancellationTimestamp: {
        type: Date,
      },
      cancellationReason: {
        type: String,
        trim: true,
      },
      // This flag can be used to automatically enforce policies
      isLateCancellation: {
        type: Boolean,
        default: false,
      },
    },
    reasonForVisit: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    notes: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    // Logistics
    location: {
      type: String,
      trim: true,
      default: "Clinic",
    },
    mode: {
      type: String,
      enum: ["in-person", "online"],
      default: "in-person",
    },

    // Tracking
    createdBy: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
    },
    lastUpdatedBy: {
      type: String,
      enum: ["patient", "doctor", "admin"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentReference: {
      type: String,
      enum: ["upi", "cash", "credit_card", "debit_card", "net_banking"],
    },

    // --- Timestamps ---
    // We manage these manually to ensure they use IST
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    // Disable default Mongoose timestamps (which use server time)
    timestamps: false,
  }
);

// Mongoose hook to set createdAt and updatedAt in IST before saving
appointmentSchema.pre("save", function (next) {
  const now = nowInIST();
  this.updatedAt = now;
  if (this.isNew) {
    this.createdAt = now;
  }
  next();
});

// Hook for 'findOneAndUpdate' to update 'updatedAt' in IST
// This is crucial for .findByIdAndUpdate() calls in your controller
appointmentSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: nowInIST() });
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
