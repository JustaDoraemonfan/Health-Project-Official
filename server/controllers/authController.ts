import type { Request, Response } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";

//Interfaces
import {
  type LoginRequest,
  RegisterRequest,
  CreateAdminRequest,
} from "../types/request.js";
import { type RefreshTokenPayload, AccessTokenPayload } from "../types/jwt.js";
import { type GetUserProfileResponse } from "../types/response.js";

//Models
import User, { type UserRole, UserDocument } from "../Models/User.js";
import Patient from "../Models/Patient.js";
import Doctor from "../Models/Doctor.js";
import Admin from "../Models/Admin.js";

//Midlleware
import asyncHandler from "../middleware/asyncHandler.js";

//Utils
import { successResponse, errorResponse } from "../utils/response.js";
import { nowInIST } from "../utils/dateUtils.js";

//Helpers
const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

const validateInput = (
  fields: Record<string, string | undefined>,
): string[] => {
  const errors: string[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (!value || typeof value !== "string" || value.trim() === "") {
      errors.push(`${key} is required`);
    }
  }
  return errors;
};

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(password);

const getJwtUser = (user: UserDocument): AccessTokenPayload => ({
  id: user.id,
  role: user.role,
});

//Access Tokens
const generateAccessToken = (user: AccessTokenPayload): string => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "30m",
    },
  );
};

const generateRefreshToken = (user: Pick<AccessTokenPayload, "id">): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "30d",
  });
};

const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const issueTokens = async (
  user: UserDocument,
  session?: mongoose.ClientSession,
) => {
  const jwtUser = getJwtUser(user);

  const accessToken = generateAccessToken(jwtUser);
  const refreshToken = generateRefreshToken(jwtUser);

  user.refreshToken = hashToken(refreshToken);

  await user.save(session ? { session } : {});

  return {
    accessToken,
    refreshToken,
  };
};

const getAdminPermissions = (
  role: NonNullable<CreateAdminRequest["adminRole"]>,
) => {
  switch (role) {
    case "superadmin":
      return {
        canApproveDoctors: true,
        canManageAdmins: true,
        canViewAnalytics: true,
        canSuspendAccounts: true,
      };

    case "verifier":
      return {
        canApproveDoctors: true,
        canManageAdmins: false,
        canViewAnalytics: false,
        canSuspendAccounts: false,
      };

    default:
      return {
        canApproveDoctors: false,
        canManageAdmins: false,
        canViewAnalytics: true,
        canSuspendAccounts: false,
      };
  }
};

//Controllers
export const registerUser = asyncHandler(
  async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const validationErrors = validateInput({ name, email, password });
    if (validationErrors.length > 0) {
      return errorResponse(res, "Validation failed", 400, validationErrors);
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, "Invalid email format", 400);
    }
    if (!isValidPassword(password)) {
      return errorResponse(
        res,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        400,
      );
    }
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return errorResponse(res, "User already exists", 409);
    }

    const validRoles: readonly UserRole[] = ["patient", "doctor"];
    const userRole = role ?? "patient";
    if (!validRoles.includes(userRole)) {
      return errorResponse(
        res,
        `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        400,
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const [user] = await User.create(
        [
          {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole,
          },
        ],
        { session },
      );
      if (userRole === "patient") {
        await Patient.create(
          [
            {
              userId: user.id,
              age: req.body.age,
              gender: req.body.gender,
            },
          ],
          { session },
        );
      } else if (userRole === "doctor") {
        await Doctor.create(
          [
            {
              userId: user.id,
              specialization: req.body.specialization,
            },
          ],
          { session },
        );
      }
      const { accessToken, refreshToken } = await issueTokens(user, session);

      await session.commitTransaction();

      setRefreshTokenCookie(res, refreshToken);

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: accessToken,
      };

      return successResponse(
        res,
        userResponse,
        "User registered successfully",
        201,
      );
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },
);

export const loginUser = asyncHandler(
  async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { email, password, expectedRole } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const validationErrors = validateInput({ email, password });
    if (validationErrors.length > 0) {
      return errorResponse(res, "Validation failed", 400, validationErrors);
    }
    if (!isValidEmail(email)) {
      return errorResponse(res, "Invalid email format", 400);
    }

    const userByEmail = await User.findOne({ email: normalizedEmail });

    if (!userByEmail) {
      return errorResponse(res, "Email not found", 404);
    }

    if (userByEmail.role !== expectedRole) {
      return errorResponse(res, "Incorrect role selected", 400);
    }

    const isMatch = await bcrypt.compare(password, userByEmail.password);
    if (!isMatch) {
      return errorResponse(res, "Incorrect password", 401);
    }

    // Update last login for admin users
    if (userByEmail.role === "admin") {
      await Admin.findOneAndUpdate(
        { userId: userByEmail.id },
        {
          "activity.lastLogin": nowInIST(),
          $push: {
            auditTrail: {
              action: "login",
              at: nowInIST(),
            },
          },
        },
      );
    }

    const { accessToken, refreshToken } = await issueTokens(userByEmail);

    setRefreshTokenCookie(res, refreshToken);

    const userResponse = {
      id: userByEmail.id,
      name: userByEmail.name,
      email: userByEmail.email,
      role: userByEmail.role,
      token: accessToken,
    };

    return successResponse(res, userResponse, "Login successful");
  },
);

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const profileData: GetUserProfileResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.role === "admin") {
      const adminProfile = await Admin.findOne({ userId: user.id })
        .select("-security.passwordHash")
        .populate("handledVerifications.doctor", "name specialization");

      if (adminProfile) {
        profileData.adminDetails = {
          adminRole: adminProfile.role,
          department: adminProfile.department,
          permissions: adminProfile.permissions,
          isActive: adminProfile.security.isActive,
          lastLogin: adminProfile.activity.lastLogin,
          verificationsHandled: adminProfile.handledVerifications.length,
        };
      }
    }

    return successResponse(res, profileData);
  },
);

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken as string | undefined;

  if (token) {
    await User.findOneAndUpdate(
      {
        refreshToken: hashToken(token),
      },
      {
        refreshToken: null,
      },
    );
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return successResponse(res, null, "Logged out successfully");
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken as string | undefined;

    if (!token) {
      return errorResponse(res, "No refresh token provided", 401);
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string,
      ) as RefreshTokenPayload;

      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== hashToken(token)) {
        return errorResponse(res, "Invalid refresh token", 401);
      }

      const newAccessToken = generateAccessToken(getJwtUser(user));

      return successResponse(
        res,
        {
          token: newAccessToken,
        },
        "Access token refreshed",
      );
    } catch {
      return errorResponse(res, "Refresh token expired or invalid", 401);
    }
  },
);

export const createAdmin = asyncHandler(
  async (req: Request<{}, {}, CreateAdminRequest>, res: Response) => {
    const { name, email, password, adminRole, department } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const validationErrors = validateInput({ name, email, password });
    if (validationErrors.length > 0) {
      return errorResponse(res, "Validation failed", 400, validationErrors);
    }
    if (!isValidEmail(email)) {
      return errorResponse(res, "Invalid email format", 400);
    }
    if (!isValidPassword(password)) {
      return errorResponse(
        res,
        "Password must be at least 8 characters with uppercase, lowercase, and a number",
        400,
      );
    }

    const validAdminRoles = ["superadmin", "verifier", "support"];
    const selectedAdminRole = adminRole || "verifier";
    if (!validAdminRoles.includes(selectedAdminRole)) {
      return errorResponse(
        res,
        `Invalid admin role. Must be one of: ${validAdminRoles.join(", ")}`,
        400,
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, "A user with this email already exists", 409);
    }

    const permissions = getAdminPermissions(selectedAdminRole);

    const hashedPassword = await bcrypt.hash(password, 12);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [user] = await User.create(
        [
          {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: "admin",
          },
        ],
        { session },
      );
      await Admin.create(
        [
          {
            userId: user.id,
            role: selectedAdminRole,
            department: department || "Verification",
            permissions,
            security: { passwordHash: password, isActive: true },
          },
        ],
        { session },
      );

      await session.commitTransaction();
      await Admin.findOneAndUpdate(
        { userId: req.user.id },
        {
          $push: {
            auditTrail: {
              action: "create_admin",
              at: nowInIST(),
              notes: `Created admin account for ${email} with role ${selectedAdminRole}`,
            },
          },
        },
      );

      return successResponse(
        res,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          adminRole: selectedAdminRole,
          department: department || "Verification",
          permissions,
        },
        "Admin account created successfully",
        201,
      );
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },
);
