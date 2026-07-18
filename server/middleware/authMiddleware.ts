import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import User, { type UserRole } from "../TSModels/User.js";
import type { AccessTokenPayload } from "../types/jwt.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as AccessTokenPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.isSuspended) {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact support.",
      });
    }
    req.user = user;
    next();
  } catch (error: unknown) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }

    next();
  };
