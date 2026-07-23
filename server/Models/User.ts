import { Schema, model, HydratedDocument } from "mongoose";

//Roles for HealthyMe Users
export type UserRole = "patient" | "doctor" | "admin";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken?: string;
  isSuspended: boolean;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    refreshToken: {
      type: String,
    },

    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ role: 1 });

const User = model<IUser>("User", userSchema);

export default User;
