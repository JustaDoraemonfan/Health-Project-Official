// controllers/authController.js
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Admin from "../models/Admin.js";

export const getCurrentUser = async (req, res) => {
  try {
    // Ensure middleware populated req.user
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    const userId = req.user._id;
    const userRole = req.user.role;

    // Base user data (common to all roles)
    let userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    switch (userRole) {
      case "doctor": {
        // patients[] and appointments[] are fetched on-demand by their own
        // hooks — loading them here on every auth check is wasteful.
        const doctor = await Doctor.findOne({ userId })
          .populate("userId", "name email role")
          .select("-patients -appointments");

        if (doctor) {
          userData.doctorProfile = doctor;
          userData.doctorId = doctor._id;
        }
        break;
      }

      case "patient": {
        // symptoms[] is fetched on-demand — excluded here.
        // assignedDoctor is kept for the dashboard status bar.
        const patient = await Patient.findOne({ userId })
          .populate("userId", "name email role")
          .populate({
            path: "assignedDoctor",
            select: "userId specialization experience consultationFee rating",
            populate: { path: "userId", select: "name email" },
          })
          .select("-symptoms");

        if (patient) {
          userData.patientProfile = patient;
          userData.patientId = patient._id;
        }
        break;
      }

      case "admin":
      case "superadmin":
      case "verifier":
      case "support": {
        // auditTrail.targetId loads arbitrary documents on every auth check.
        // Removed — audit trail is only needed on the dedicated audit page.
        const admin = await Admin.findOne({ userId })
          .populate("userId", "name email role")
          .populate({
            path: "handledVerifications.doctor",
            select: "userId specialization verification.status",
            populate: { path: "userId", select: "name email" },
          })
          .select("-auditTrail");

        if (admin) {
          userData.adminProfile = admin;
          userData.adminId = admin._id;
          userData.permissions = admin.permissions;
          userData.department = admin.department;
        }
        break;
      }

      default:
        break;
    }

    return res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
      error: error.message,
    });
  }
};
