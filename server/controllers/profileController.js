import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import FWL from "../models/FWL.js";

export const getProfile = async (req, res) => {
  try {
    const { role, id } = req.user; // use id, not userId
    let profile;

    switch (role) {
      case "patient":
        profile = await Patient.findOne({ userId: id }).populate(
          "userId",
          "name email role"
        );
        break;
      case "doctor":
        profile = await Doctor.findOne({ userId: id }).populate(
          "userId",
          "name email role"
        );
        break;
      case "frontlineWorker":
        profile = await FWL.findOne({ userId: id }).populate(
          "userId",
          "name email role"
        );
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
