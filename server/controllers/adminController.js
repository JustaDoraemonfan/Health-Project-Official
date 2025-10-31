import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import FrontlineWorker from "../models/FWL.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { getSignedUrl } from "../utils/s3Helper.js";
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js"; // Import IST constant

// ==================== ADMIN MANAGEMENT ====================

// @desc Get all admins (superadmin only)
// @route GET /api/admin/admins
// @access Private (Superadmin)
export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find()
    .populate("userId", "name email")
    .select("-security.passwordHash")
    .lean();

  return successResponse(res, admins, "Admins fetched successfully");
});

// @desc Get single admin
// @route GET /api/admin/admins/:id
// @access Private (Superadmin)
export const getAdmin = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, "Invalid admin ID", 400);
  }

  const admin = await Admin.findById(req.params.id)
    .populate("userId", "name email")
    .populate("handledVerifications.doctor", "name specialization")
    .select("-security.passwordHash")
    .lean();

  if (!admin) return errorResponse(res, "Admin not found", 404);

  return successResponse(res, admin, "Admin fetched successfully");
});

// @desc Update admin (superadmin only)
// @route PUT /api/admin/admins/:id
// @access Private (Superadmin)
export const updateAdmin = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, "Invalid admin ID", 400);
  }

  const { role, department, permissions, isActive } = req.body;
  const updateData = {};

  if (role) updateData.role = role;
  if (department) updateData.department = department;
  if (permissions) updateData.permissions = permissions;
  if (typeof isActive === "boolean") updateData["security.isActive"] = isActive;

  const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate("userId", "name email");

  if (!admin) return errorResponse(res, "Admin not found", 404);

  // Log action in audit trail
  await Admin.findByIdAndUpdate(req.user.adminId, {
    $push: {
      auditTrail: {
        action: "update_admin",
        targetId: admin._id,
        at: nowInIST(), // Use IST time
        notes: `Updated admin: ${admin.userId.name}`,
      },
    },
  });

  return successResponse(res, admin, "Admin updated successfully");
});

// @desc Delete admin (superadmin only)
// @route DELETE /api/admin/admins/:id
// @access Private (Superadmin)
export const deleteAdmin = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, "Invalid admin ID", 400);
  }

  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) return errorResponse(res, "Admin not found", 404);

  // Also delete the associated User account
  await User.findByIdAndDelete(admin.userId);

  return successResponse(res, admin, "Admin deleted successfully");
});

// ==================== DOCTOR VERIFICATION ====================

// @desc Get all pending doctor verifications
// @route GET /api/admin/verifications/pending
// @access Private (Admin with canApproveDoctors permission)

export const getPendingVerifications = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({ "verification.status": "pending" })
    .populate("userId", "name email")
    .lean();

  // Generate signed URLs for all documents
  const updatedDoctors = doctors.map((doc) => {
    if (doc.verification?.evidence) {
      const evidence = doc.verification.evidence;
      const signedEvidence = {};

      // Generate signed URLs for each document type
      Object.keys(evidence).forEach((key) => {
        if (evidence[key]) {
          // Extract S3 key from full URL
          // Example: https://bucket.s3.region.amazonaws.com/path/file.jpg -> path/file.jpg
          const url = evidence[key];
          const urlParts = url.split(".amazonaws.com/");
          const s3Key = urlParts.length > 1 ? urlParts[1] : url;

          signedEvidence[key] = {
            originalUrl: evidence[key],
            s3Key: s3Key,
            signedUrl: getSignedUrl(s3Key, 3600), // 1 hour expiry
          };
        }
      });

      doc.verification.evidence = signedEvidence;
    }

    return doc;
  });

  return successResponse(
    res,
    updatedDoctors,
    "Pending verifications fetched successfully"
  );
});

// @desc Get all verifications (any status)
// @route GET /api/admin/verifications
// @access Private (Admin)
export const getAllVerifications = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = {};
  if (status) {
    filter["verification.status"] = status;
  }

  const doctors = await Doctor.find(filter)
    .populate("userId", "name email")
    .sort({ "verification.appliedAt": -1 })
    .lean();

  return successResponse(res, doctors, "Verifications fetched successfully");
});

// @desc Approve doctor verification
// @route POST /api/admin/verifications/:doctorId/approve
// @access Private (Admin with canApproveDoctors permission)
export const approveVerification = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.doctorId)) {
    return errorResponse(res, "Invalid doctor ID", 400);
  }

  const { notes } = req.body;

  const doctor = await Doctor.findById(req.params.doctorId);
  if (!doctor) return errorResponse(res, "Doctor not found", 404);

  if (doctor.verification.status !== "pending") {
    return errorResponse(
      res,
      `Verification is already ${doctor.verification.status}`,
      400
    );
  }

  // Update doctor verification status
  doctor.verification.status = "verified";
  doctor.verification.verifiedAt = nowInIST(); // Use IST time
  doctor.verification.verifiedBy = req.user.id;
  await doctor.save();

  // Log in admin's handled verifications
  const admin = await Admin.findOne({ userId: req.user.id });
  if (admin) {
    admin.handledVerifications.push({
      doctor: doctor._id,
      action: "approved",
      at: nowInIST(), // Use IST time
      notes: notes || "Verification approved !",
    });

    admin.auditTrail.push({
      action: "approve_verification",
      targetId: doctor._id,
      at: nowInIST(), // Use IST time
      notes: notes || "Approved doctor verification",
    });

    await admin.save();
  }

  return successResponse(res, doctor, "Doctor verification approved");
});

// @desc Reject doctor verification
// @route POST /api/admin/verifications/:doctorId/reject
// @access Private (Admin with canApproveDoctors permission)
export const rejectVerification = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.doctorId)) {
    return errorResponse(res, "Invalid doctor ID", 400);
  }

  const { reason } = req.body;

  if (!reason) {
    return errorResponse(res, "Rejection reason is required", 400);
  }

  const doctor = await Doctor.findById(req.params.doctorId);
  if (!doctor) return errorResponse(res, "Doctor not found", 404);

  if (doctor.verification.status !== "pending") {
    return errorResponse(
      res,
      `Verification is already ${doctor.verification.status}`,
      400
    );
  }

  // Update doctor verification status
  doctor.verification.status = "rejected";
  doctor.verification.rejectionReason = reason;
  doctor.verification.reviewedAt = nowInIST(); // Use IST time
  doctor.verification.reviewedBy = req.user.id;
  await doctor.save();

  // Log in admin's handled verifications
  const admin = await Admin.findOne({ userId: req.user.id });
  if (admin) {
    admin.handledVerifications.push({
      doctor: doctor._id,
      action: "rejected",
      at: nowInIST(), // Use IST time
      notes: reason,
    });

    admin.auditTrail.push({
      action: "reject_verification",
      targetId: doctor._id,
      at: nowInIST(), // Use IST time
      notes: `Rejected: ${reason}`,
    });

    await admin.save();
  }

  return successResponse(res, doctor, "Doctor verification rejected");
});

// ==================== ACCOUNT MANAGEMENT ====================

// @desc Suspend a user account
// @route POST /api/admin/users/:userId/suspend
// @access Private (Admin with canSuspendAccounts permission)
export const suspendAccount = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return errorResponse(res, "Invalid user ID", 400);
  }

  const { reason } = req.body;

  if (!reason) {
    return errorResponse(res, "Suspension reason is required", 400);
  }

  const user = await User.findById(req.params.userId);
  if (!user) return errorResponse(res, "User not found", 404);

  // Add suspended flag to user (you may need to add this field to User model)
  user.isSuspended = true;
  user.suspensionReason = reason;
  user.suspendedAt = nowInIST(); // Use IST time
  await user.save();

  // Log action
  const admin = await Admin.findOne({ userId: req.user.id });
  if (admin) {
    admin.auditTrail.push({
      action: "suspend_account",
      targetId: user._id,
      at: nowInIST(), // Use IST time
      notes: reason,
    });
    await admin.save();
  }

  return successResponse(res, user, "Account suspended successfully");
});

// @desc Reactivate a suspended account
// @route POST /api/admin/users/:userId/reactivate
// @access Private (Admin with canSuspendAccounts permission)
export const reactivateAccount = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return errorResponse(res, "Invalid user ID", 400);
  }

  const user = await User.findById(req.params.userId);
  if (!user) return errorResponse(res, "User not found", 404);

  user.isSuspended = false;
  user.suspensionReason = null;
  user.suspendedAt = null;
  await user.save();

  return successResponse(res, user, "Account reactivated successfully");
});

// ==================== ANALYTICS & REPORTS ====================

// @desc Get dashboard analytics
// @route GET /api/admin/analytics/dashboard
// @access Private (Admin with canViewAnalytics permission)
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const [
    totalPatients,
    totalDoctors,
    totalFrontlineWorkers,
    pendingVerifications,
    verifiedDoctors,
    rejectedVerifications,
  ] = await Promise.all([
    Patient.countDocuments(),
    Doctor.countDocuments(),
    FrontlineWorker.countDocuments(),
    Doctor.countDocuments({ "verification.status": "pending" }),
    Doctor.countDocuments({ "verification.status": "verified" }),
    Doctor.countDocuments({ "verification.status": "rejected" }),
  ]);

  const analytics = {
    users: {
      totalPatients,
      totalDoctors,
      totalFrontlineWorkers,
      totalUsers: totalPatients + totalDoctors + totalFrontlineWorkers,
    },
    verifications: {
      pending: pendingVerifications,
      verified: verifiedDoctors,
      rejected: rejectedVerifications,
      total: pendingVerifications + verifiedDoctors + rejectedVerifications,
    },
  };

  return successResponse(res, analytics, "Analytics fetched successfully");
});

// @desc Get admin activity log
// @route GET /api/admin/activity
// @access Private (Admin)
export const getAdminActivity = asyncHandler(async (req, res) => {
  const adminId =
    req.user.adminId || (await Admin.findOne({ userId: req.user.id }))?._id;

  if (!adminId) {
    return errorResponse(res, "Admin profile not found", 404);
  }

  const admin = await Admin.findById(adminId)
    .populate("handledVerifications.doctor", "name specialization")
    .select("handledVerifications auditTrail activity")
    .lean();

  if (!admin) return errorResponse(res, "Admin not found", 404);

  return successResponse(res, admin, "Activity log fetched successfully");
});

// @desc Get all users (for admin user management)
// @route GET /api/admin/users
// @access Private (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role) filter.role = role;

  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .select("-password")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })
    .lean();

  const total = await User.countDocuments(filter);

  return successResponse(
    res,
    {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Users fetched successfully"
  );
});

// @desc Update admin password
// @route PUT /api/admin/password
// @access Private (Admin)
export const updateAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return errorResponse(res, "Current and new password are required", 400);
  }

  const admin = await Admin.findOne({ userId: req.user.id });
  if (!admin) return errorResponse(res, "Admin profile not found", 404);

  // Verify current password
  const isMatch = await admin.matchPassword(currentPassword);
  if (!isMatch) {
    return errorResponse(res, "Current password is incorrect", 401);
  }

  // Update password
  admin.security.passwordHash = newPassword; // Will be hashed by pre-save hook
  admin.security.lastPasswordChange = nowInIST(); // Use IST time
  await admin.save();

  return successResponse(res, null, "Password updated successfully");
});
