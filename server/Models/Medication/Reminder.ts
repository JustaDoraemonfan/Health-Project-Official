import { Schema, model, type HydratedDocument, Types } from "mongoose";

export type ReminderFrequency = "daily" | "multiple_times" | "intervalHours";

export type ReminderDailyStatus = "taken" | "missed" | "pending";

export interface IReminder {
  userId: Types.ObjectId;

  medicine: string;
  dosage?: string;

  frequency: ReminderFrequency;

  times: string[];

  intervalHours?: number;

  startDate: Date;

  endDate?: Date | null;

  timezone: string;

  notes?: string;

  isActive: boolean;

  doctorNote: string;

  reviewedBy?: Types.ObjectId;

  dailyStatus: Map<string, ReminderDailyStatus>;

  createdAt?: Date;
  updatedAt?: Date;
}

export type ReminderDocument = HydratedDocument<IReminder>;

const reminderSchema = new Schema<IReminder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medicine: {
      type: String,
      required: true,
    },

    dosage: {
      type: String,
    },

    frequency: {
      type: String,
      enum: ["daily", "multiple_times", "intervalHours"],
      default: "daily",
    },

    times: [
      {
        type: String,
      },
    ],

    intervalHours: {
      type: Number,
    },

    startDate: {
      type: Date,
      default: () => new Date(),
    },

    endDate: {
      type: Date,
      default: null,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    notes: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    doctorNote: {
      type: String,
      default: "",
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    dailyStatus: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

reminderSchema.index({
  userId: 1,
  createdAt: -1,
});

reminderSchema.index({
  userId: 1,
  isActive: 1,
});

const Reminder = model<IReminder>("Reminder", reminderSchema);

export default Reminder;
