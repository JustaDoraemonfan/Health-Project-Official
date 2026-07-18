import { Schema, model, type HydratedDocument, Types } from "mongoose";
import { nowInIST } from "../utils/dateUtils.js";

export type AppointmentType =
  | "consultation"
  | "follow-up"
  | "check-up"
  | "emergency";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled-by-patient"
  | "cancelled-by-doctor"
  | "no-show";

export type AppointmentActor = "patient" | "doctor" | "admin";

export type AppointmentMode = "in-person" | "online";

export type PaymentMethod =
  | "upi"
  | "cash"
  | "credit_card"
  | "debit_card"
  | "net_banking";

export interface CancellationDetails {
  cancelledBy?: AppointmentActor;
  cancellationTimestamp?: Date;
  cancellationReason?: string;
  isLateCancellation: boolean;
}

export interface IAppointment {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  doctorProfile: Types.ObjectId;

  appointmentDate: Date;
  appointmentTime: string;

  type: AppointmentType;
  status: AppointmentStatus;

  cancellationDetails: CancellationDetails;

  reasonForVisit?: string;
  notes?: string;

  location: string;
  mode: AppointmentMode;

  createdBy: AppointmentActor;
  lastUpdatedBy?: AppointmentActor;

  isPaid: boolean;
  paymentReference?: PaymentMethod;

  createdAt?: Date;
  updatedAt?: Date;
}

export type AppointmentDocument = HydratedDocument<IAppointment>;

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorProfile: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // Date & Time

    appointmentDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          const now = nowInIST();

          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );

          const apptDate = new Date(
            value.getFullYear(),
            value.getMonth(),
            value.getDate(),
          );

          return apptDate >= today;
        },
        message: "Appointment date cannot be in the past.",
      },
    },

    appointmentTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/,
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
        "confirmed",
        "completed",
        "cancelled-by-patient",
        "cancelled-by-doctor",
        "no-show",
      ],
      default: "scheduled",
    },

    cancellationDetails: {
      cancelledBy: {
        type: String,
        enum: ["patient", "doctor", "admin"],
      },

      cancellationTimestamp: {
        type: Date,
      },

      cancellationReason: {
        type: String,
        trim: true,
      },

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
      trim: true,
      maxlength: 500,
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

    // Timestamps

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

appointmentSchema.pre("save", function (next) {
  const now = nowInIST();

  this.updatedAt = now;

  if (this.isNew) {
    this.createdAt = now;
  }

  next();
});

appointmentSchema.pre("findOneAndUpdate", function (next) {
  this.set({
    updatedAt: nowInIST(),
  });

  next();
});

// Patient dashboard & calendar
appointmentSchema.index({
  patient: 1,
  appointmentDate: -1,
});

// Doctor dashboard & calendar
appointmentSchema.index({
  doctor: 1,
  appointmentDate: -1,
});

// Upcoming/Past appointments
appointmentSchema.index({
  patient: 1,
  status: 1,
  appointmentDate: 1,
});

appointmentSchema.index({
  doctor: 1,
  status: 1,
  appointmentDate: 1,
});

// Admin appointment list
appointmentSchema.index({
  appointmentDate: -1,
});

// Aggregate stats
appointmentSchema.index({
  doctor: 1,
});

const Appointment = model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;
