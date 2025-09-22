import mongoose from "mongoose";

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
          return value >= new Date(); // No past appointments allowed
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
      minlength: 5,
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
      trim: true,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
