import express from "express";
import {
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getPendingVerifications,
  getAllVerifications,
  approveVerification,
  rejectVerification,
  suspendAccount,
  reactivateAccount,
  getDashboardAnalytics,
  getAdminActivity,
  getAllUsers,
  updateAdminPassword,
} from "../controllers/adminController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import {
  requireAdmin,
  requirePermission,
  requireSuperadmin,
} from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==================== ADMIN MANAGEMENT ROUTES ====================
// All admin management routes require superadmin access

router
  .route("/")
  .get(authMiddleware, requireAdmin, requireSuperadmin, getAllAdmins);

router
  .route("/:id")
  .get(authMiddleware, requireAdmin, getAdmin)
  .put(authMiddleware, requireAdmin, requireSuperadmin, updateAdmin)
  .delete(authMiddleware, requireAdmin, requireSuperadmin, deleteAdmin);

// ==================== DOCTOR VERIFICATION ROUTES ====================

router
  .route("/verifications/pending")
  .get(
    authMiddleware,
    requireAdmin,
    requirePermission("canApproveDoctors"),
    getPendingVerifications
  );

router
  .route("/verifications")
  .get(authMiddleware, requireAdmin, getAllVerifications);

router
  .route("/verifications/:doctorId/approve")
  .post(
    authMiddleware,
    requireAdmin,
    requirePermission("canApproveDoctors"),
    approveVerification
  );

router
  .route("/verifications/:doctorId/reject")
  .post(
    authMiddleware,
    requireAdmin,
    requirePermission("canApproveDoctors"),
    rejectVerification
  );

// ==================== ACCOUNT MANAGEMENT ROUTES ====================

router
  .route("/users/:userId/suspend")
  .post(
    authMiddleware,
    requireAdmin,
    requirePermission("canSuspendAccounts"),
    suspendAccount
  );

router
  .route("/users/:userId/reactivate")
  .post(
    authMiddleware,
    requireAdmin,
    requirePermission("canSuspendAccounts"),
    reactivateAccount
  );

// ==================== ANALYTICS & REPORTS ROUTES ====================

router
  .route("/analytics/dashboard")
  .get(
    authMiddleware,
    requireAdmin,
    requirePermission("canViewAnalytics"),
    getDashboardAnalytics
  );

router.route("/activity").get(authMiddleware, requireAdmin, getAdminActivity);

// ==================== USER MANAGEMENT ROUTES ====================

router.route("/users").get(authMiddleware, requireAdmin, getAllUsers);

// ==================== ADMIN PROFILE ROUTES ====================

router
  .route("/password")
  .put(authMiddleware, requireAdmin, updateAdminPassword);

export default router;
