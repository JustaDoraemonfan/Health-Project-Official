import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: { type: String, required: true },
    location: { type: String },
    availability: [
      {
        day: String, // "Monday"
        slots: [String], // ["9:00 AM", "10:30 AM"]
      },
    ],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
