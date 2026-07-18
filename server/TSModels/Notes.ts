import { Schema, model, type HydratedDocument, Types } from "mongoose";

export type NoteCategory =
  | "General Advice"
  | "Follow-up"
  | "Medication"
  | "Lifestyle/Diet"
  | "Lab Result";

export type NotePriority = "Normal" | "Important" | "Urgent";

export interface INote {
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;

  title: string;
  content: string;

  category: NoteCategory;
  priority: NotePriority;

  isRead: boolean;
  acknowledged: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export type NoteDocument = HydratedDocument<INote>;

const noteSchema = new Schema<INote>(
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

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "General Advice",
        "Follow-up",
        "Medication",
        "Lifestyle/Diet",
        "Lab Result",
      ],
      default: "General Advice",
    },

    priority: {
      type: String,
      enum: ["Normal", "Important", "Urgent"],
      default: "Normal",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    acknowledged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

noteSchema.index({ doctorId: 1, createdAt: -1 });
noteSchema.index({ patientId: 1, createdAt: -1 });
noteSchema.index({ doctorId: 1, patientId: 1 });
noteSchema.index({ patientId: 1, isRead: 1 });

const Note = model<INote>("Note", noteSchema);

export default Note;
