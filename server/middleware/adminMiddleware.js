import Admin from "../models/Admin.js";
import { errorResponse } from "../utils/response.js";

// Middleware to check if user is an admin
export const requireAdmin = async (req, res, next) => {
  try {
    // req.user should be set by the protect middleware (authMiddleware)
    if (!req.user) {
      return errorResponse(res, "Authentication required", 401);
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
      return errorResponse(
        res,
        "Access denied. Admin privileges required",
        403
      );
    }

    // Fetch admin profile and attach to request
    const admin = await Admin.findOne({ userId: req.user.id });

    if (!admin) {
      return errorResponse(res, "Admin profile not found", 404);
    }

    // Check if admin account is active
    if (!admin.security.isActive) {
      return errorResponse(
        res,
        "Admin account is inactive. Please contact support",
        403
      );
    }

    // Attach admin profile to request for use in controllers
    req.adminProfile = admin;
    req.user.adminId = admin._id;

    next();
  } catch (error) {
    return errorResponse(res, "Error verifying admin access", 500);
  }
};

// Middleware to check if admin is a superadmin
export const requireSuperadmin = (req, res, next) => {
  if (!req.adminProfile) {
    return errorResponse(res, "Admin profile not found", 404);
  }

  if (req.adminProfile.role !== "superadmin") {
    return errorResponse(
      res,
      "Access denied. Superadmin privileges required",
      403
    );
  }

  next();
};

// Middleware to check specific permission
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.adminProfile) {
      return errorResponse(res, "Admin profile not found", 404);
    }

    // Superadmins have all permissions
    if (req.adminProfile.role === "superadmin") {
      return next();
    }

    // Check if admin has the required permission
    if (!req.adminProfile.permissions[permission]) {
      return errorResponse(
        res,
        `Access denied. Required permission: ${permission}`,
        403
      );
    }

    next();
  };
};

// Middleware to check multiple permissions (admin must have at least one)
export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.adminProfile) {
      return errorResponse(res, "Admin profile not found", 404);
    }

    // Superadmins have all permissions
    if (req.adminProfile.role === "superadmin") {
      return next();
    }

    // Check if admin has any of the required permissions
    const hasPermission = permissions.some(
      (permission) => req.adminProfile.permissions[permission]
    );

    if (!hasPermission) {
      return errorResponse(
        res,
        `Access denied. Required one of: ${permissions.join(", ")}`,
        403
      );
    }

    next();
  };
};

// Middleware to check multiple permissions (admin must have all)
export const requireAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.adminProfile) {
      return errorResponse(res, "Admin profile not found", 404);
    }

    // Superadmins have all permissions
    if (req.adminProfile.role === "superadmin") {
      return next();
    }

    // Check if admin has all required permissions
    const hasAllPermissions = permissions.every(
      (permission) => req.adminProfile.permissions[permission]
    );

    if (!hasAllPermissions) {
      return errorResponse(
        res,
        `Access denied. Required all of: ${permissions.join(", ")}`,
        403
      );
    }

    next();
  };
};

// Middleware to log admin actions
export const logAdminAction = (action) => {
  return async (req, res, next) => {
    try {
      if (req.adminProfile) {
        // Store action details for later logging in controller
        req.adminAction = {
          action,
          timestamp: new Date(),
          ip: req.ip || req.connection.remoteAddress,
        };
      }
      next();
    } catch (error) {
      // Don't block the request if logging fails
      console.error("Error logging admin action:", error);
      next();
    }
  };
};
