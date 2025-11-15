import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

export const uploadProfilePhotoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const userId = req.user.id; // comes from JWT
    const userType = req.user.role; // comes from JWT

    if (!userId || !userType) {
      return res.status(400).json({ message: "Missing user identification" });
    }

    const photoURL = req.file.location;
    const photoKey = req.file.key;

    let Model = null;

    if (userType === "doctor") {
      Model = Doctor;
    } else if (userType === "patient") {
      Model = Patient;
    } else {
      return res.status(403).json({
        message: "Only patients and doctors can upload profile photos",
      });
    }

    const updated = await Model.findOneAndUpdate(
      { userId },
      {
        profilePhoto: photoURL,
        profilePhotoKey: photoKey,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User profile record not found" });
    }

    return res.json({
      success: true,
      message: "Profile photo updated successfully",
      photoURL,
    });
  } catch (err) {
    console.error("Profile photo upload error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
