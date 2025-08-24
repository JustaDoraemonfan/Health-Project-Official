import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
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
      enum: ["patient", "doctor", "frontlineWorker", "admin"],
      default: "patient",
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields to the schema
);

const User = mongoose.model("User", userSchema);
export default User;
