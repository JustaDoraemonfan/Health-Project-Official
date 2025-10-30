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
        const doctor = await Doctor.findOne({ userId })
          .populate("userId", "name email role")
          .populate({
            path: "patients",
            populate: { path: "userId", select: "name email" },
          })
          .populate({
            path: "appointments",
            populate: [
              { path: "patient", select: "userId age gender" },
              { path: "doctor", select: "userId specialization" },
            ],
          })
          .populate("verification.reviewedBy", "name email role")
          .populate("verification.verifiedBy", "name email role");

        if (doctor) {
          userData.doctorProfile = doctor;
          userData.doctorId = doctor._id;
        }
        break;
      }

      case "patient": {
        const patient = await Patient.findOne({ userId })
          .populate("userId", "name email role")
          .populate("symptoms", "name severity category")
          .populate({
            path: "assignedDoctor",
            populate: {
              path: "userId",
              select:
                "name email specialization experience consultationFee rating",
            },
          });

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
        const admin = await Admin.findOne({ userId })
          .populate("userId", "name email role")
          .populate({
            path: "handledVerifications.doctor",
            populate: { path: "userId", select: "name email" },
          })
          .populate("auditTrail.targetId");

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
