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
    experience: { type: Number, default: 0 }, // years of experience
    location: { type: String },
    isAvailable: {
      type: String,
      enum: ["Available", "Busy", "In Surgery", "On Break", "Offline"],
      default: "Available",
    },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    education: { type: String },
    languages: [{ type: String }],

    consultationFee: { type: Number, default: 0 },
    nextAvailable: { type: String }, // e.g. "Today, 4:15 PM"

    certifications: [{ type: String }],
    about: { type: String },
    phone: { type: String },

    availability: [
      {
        day: String, // e.g. "Monday"
        slots: [String], // e.g. ["9:00 AM", "10:30 AM"]
      },
    ],

    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment", // reference to the Appointment model
      },
    ],
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
