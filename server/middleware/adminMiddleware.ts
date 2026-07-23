import type { RequestHandler, Request, Response, NextFunction } from "express";
import Admin, { type Permission } from "../Models/Admin.js";
import { errorResponse } from "../utils/response.js";

// Middleware to check if user is an admin
export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return errorResponse(res, "Authentication required", 401);
    }

    if (req.user.role !== "admin") {
      return errorResponse(
        res,
        "Access denied. Admin privileges required",
        403,
      );
    }

    const admin = await Admin.findOne({ userId: req.user.id });

    if (!admin) {
      return errorResponse(res, "Admin profile not found", 404);
    }

    if (!admin.security.isActive) {
      return errorResponse(
        res,
        "Admin account is inactive. Please contact support",
        403,
      );
    }
    req.adminProfile = admin;

    next();
  } catch (error) {
    return errorResponse(res, "Error verifying admin access", 500);
  }
};

// Middleware to check if admin is a superadmin
export const requireSuperadmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.adminProfile) {
    return errorResponse(res, "Admin profile not found", 404);
  }

  if (req.adminProfile.role !== "superadmin") {
    return errorResponse(
      res,
      "Access denied. Superadmin privileges required",
      403,
    );
  }

  next();
};

// Middleware to check specific permission
export const requirePermission = (permission: Permission): RequestHandler => {
  return (req, res, next) => {
    if (!req.adminProfile) {
      return errorResponse(res, "Admin profile not found", 404);
    }

    if (req.adminProfile.role === "superadmin") {
      return next();
    }

    if (!req.adminProfile.permissions[permission]) {
      return errorResponse(
        res,
        `Access denied. Required permission: ${permission}`,
        403,
      );
    }

    next();
  };
};

// Middleware to check multiple permissions (admin must have at least one)
export const requireAnyPermission = (
  ...permissions: Permission[]
): RequestHandler => {
  return (req, res, next) => {
    if (!req.adminProfile) {
      return errorResponse(res, "Admin profile not found", 404);
    }

    if (req.adminProfile.role === "superadmin") {
      return next();
    }

    const hasPermission = permissions.some(
      (permission) => req.adminProfile.permissions[permission],
    );

    if (!hasPermission) {
      return errorResponse(
        res,
        `Access denied. Required one of: ${permissions.join(", ")}`,
        403,
      );
    }

    next();
  };
};

// Middleware to check multiple permissions (admin must have all)
export const requireAllPermissions = (
  ...permissions: Permission[]
): RequestHandler => {
  return (req, res, next) => {
    if (!req.adminProfile) {
      return errorResponse(res, "Admin profile not found", 404);
    }

    if (req.adminProfile.role === "superadmin") {
      return next();
    }

    const hasAllPermissions = permissions.every(
      (permission) => req.adminProfile.permissions[permission],
    );

    if (!hasAllPermissions) {
      return errorResponse(
        res,
        `Access denied. Required all of: ${permissions.join(", ")}`,
        403,
      );
    }

    next();
  };
};

// Middleware to log admin actions
export const logAdminAction = (action: string): RequestHandler => {
  return async (req, res, next) => {
    try {
      if (req.adminProfile) {
        req.adminAction = {
          action,
          timestamp: new Date(),
          ip: req.ip || req.socket.remoteAddress || "unknown",
        };
      }
      next();
    } catch (error) {
      console.error("Error logging admin action:", error);
      next();
    }
  };
};
