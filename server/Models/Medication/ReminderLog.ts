import { Schema, model, type HydratedDocument, Types } from "mongoose";

export type ReminderLogStatus = "taken" | "skipped" | "missed";

export interface IReminderLog {
  reminderId: Types.ObjectId;

  userId: Types.ObjectId;

  scheduledFor: Date;

  status?: ReminderLogStatus;

  respondedAt?: Date | null;

  note: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type ReminderLogDocument = HydratedDocument<IReminderLog>;

const reminderLogSchema = new Schema<IReminderLog>(
  {
    reminderId: {
      type: Schema.Types.ObjectId,
      ref: "Reminder",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scheduledFor: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["taken", "skipped", "missed"],
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

reminderLogSchema.index({
  userId: 1,
  scheduledFor: -1,
});

reminderLogSchema.index({
  status: 1,
  scheduledFor: 1,
});

reminderLogSchema.index({
  reminderId: 1,
  scheduledFor: -1,
});

const ReminderLog = model<IReminderLog>("ReminderLog", reminderLogSchema);

export default ReminderLog;
