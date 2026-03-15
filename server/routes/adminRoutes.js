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
import { createAdmin } from "../controllers/authController.js";
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

// ==================== RULE: specific routes MUST come before /:id ====================
// Express matches top-to-bottom. Any route with a fixed path segment
// (e.g. /create-admin, /verifications, /activity) must be declared
// BEFORE /:id — otherwise Express treats the segment as an ID param
// and the real handler is never reached.
// =====================================================================================

// ==================== ADMIN CREATION (Superadmin only) ====================
router
  .route("/create-admin")
  .post(authMiddleware, requireAdmin, requireSuperadmin, createAdmin);

// ==================== DOCTOR VERIFICATION ROUTES ====================
router
  .route("/verifications/pending")
  .get(
    authMiddleware,
    requireAdmin,
    requirePermission("canApproveDoctors"),
    getPendingVerifications,
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
    approveVerification,
  );

router
  .route("/verifications/:doctorId/reject")
  .post(
    authMiddleware,
    requireAdmin,
    requirePermission("canApproveDoctors"),
    rejectVerification,
  );

// ==================== ACCOUNT MANAGEMENT ROUTES ====================
router
  .route("/users/:userId/suspend")
  .post(
    authMiddleware,
    requireAdmin,
    requirePermission("canSuspendAccounts"),
    suspendAccount,
  );

router
  .route("/users/:userId/reactivate")
  .post(
    authMiddleware,
    requireAdmin,
    requirePermission("canSuspendAccounts"),
    reactivateAccount,
  );

// ==================== ANALYTICS & REPORTS ROUTES ====================
router
  .route("/analytics/dashboard")
  .get(
    authMiddleware,
    requireAdmin,
    requirePermission("canViewAnalytics"),
    getDashboardAnalytics,
  );

// ==================== ACTIVITY & USER MANAGEMENT ====================
router.route("/activity").get(authMiddleware, requireAdmin, getAdminActivity);
router.route("/users").get(authMiddleware, requireAdmin, getAllUsers);

// ==================== ADMIN PROFILE ROUTES ====================
router
  .route("/password")
  .put(authMiddleware, requireAdmin, updateAdminPassword);

// ==================== ADMIN MANAGEMENT ROUTES ====================
// /:id MUST be last — it is a wildcard that catches everything above
// if placed earlier
router
  .route("/")
  .get(authMiddleware, requireAdmin, requireSuperadmin, getAllAdmins);

router
  .route("/:id")
  .get(authMiddleware, requireAdmin, getAdmin)
  .put(authMiddleware, requireAdmin, requireSuperadmin, updateAdmin)
  .delete(authMiddleware, requireAdmin, requireSuperadmin, deleteAdmin);

export default router;
