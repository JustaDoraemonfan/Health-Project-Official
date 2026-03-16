import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import FrontlineWorker from "../models/FWL.js";
import Admin from "../models/Admin.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js"; // Import IST constant

// Helper function to get the current time in IST

// Generate short-lived access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }, // short lifespan
  );
};

// Generate long-lived refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

// One-way hash for storing refresh tokens in the DB.
// The raw token lives only in the HttpOnly cookie — the DB stores only
// the hash, so a database breach can't be used to hijack sessions.
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Validation helpers
const validateInput = (fields) => {
  const errors = [];
  for (const [key, value] of Object.entries(fields)) {
    if (!value || typeof value !== "string" || value.trim() === "") {
      errors.push(`${key} is required`);
    }
  }
  return errors;
};
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(password);

// -----------------------------------SignUp----------------------------------------

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Input validation
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

  // "admin" is intentionally excluded — admins can only be created
  // by an existing superadmin via POST /api/admin/create-admin
  const validRoles = ["patient", "doctor", "frontlineWorker"];
  const userRole = role || "patient";
  if (!validRoles.includes(userRole)) {
    return errorResponse(
      res,
      `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      400,
    );
  }

  // Check if user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return errorResponse(res, "User already exists", 409);
  }

  // Validate role-specific required fields BEFORE touching the DB.
  // Catching this here avoids starting a transaction that we know will fail.
  if (userRole === "frontlineWorker") {
    const { phone, location } = req.body;
    if (!phone || !location) {
      return errorResponse(
        res,
        "Phone number and location are required for frontline workers",
        400,
      );
    }
  }

  // Use a session so User + role-profile are created atomically.
  // If the profile create fails, the User record is rolled back —
  // no orphaned accounts that block re-registration on the same email.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const [user] = await User.create(
      [
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: userRole,
        },
      ],
      { session },
    );

    // Create role-specific record linked by userId
    if (userRole === "patient") {
      const { age, gender } = req.body;
      await Patient.create(
        [
          {
            userId: user.id,
            age: age ? parseInt(age) : null,
            gender: gender || "other",
            assignedDoctor: null,
          },
        ],
        { session },
      );
    } else if (userRole === "doctor") {
      const { phone, location, specialization } = req.body;
      await Doctor.create(
        [
          {
            userId: user.id,
            phone,
            location,
            specialization: specialization || "",
            patients: [],
          },
        ],
        { session },
      );
    } else if (userRole === "frontlineWorker") {
      const { phone, location } = req.body;
      await FrontlineWorker.create([{ userId: user.id, phone, location }], {
        session,
      });
    }

    await session.commitTransaction();

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateAccessToken(user),
    };

    return successResponse(
      res,
      userResponse,
      "User registered successfully",
      201,
    );
  } catch (err) {
    await session.abortTransaction();
    throw err; // re-throw so asyncHandler / errorMiddleware returns a clean 500
  } finally {
    session.endSession();
  }
});

// Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, expectedRole } = req.body;

  const validationErrors = validateInput({ email, password });
  if (validationErrors.length > 0) {
    return errorResponse(res, "Validation failed", 400, validationErrors);
  }
  if (!isValidEmail(email)) {
    return errorResponse(res, "Invalid email format", 400);
  }
  if (!expectedRole) {
    return errorResponse(res, "Valid role required!");
  }
  const userByEmail = await User.findOne({ email: email.toLowerCase() });

  if (!userByEmail) {
    return errorResponse(res, "Email not found", 404);
  }

  if (userByEmail.role !== expectedRole.toLowerCase()) {
    return errorResponse(res, "Incorrect role selected", 400);
  }

  const isMatch = await bcrypt.compare(password, userByEmail.password);
  if (!isMatch) {
    return errorResponse(res, "Incorrect password", 401);
  }

  const user = userByEmail;

  // Update last login for admin users
  if (user.role === "admin") {
    await Admin.findOneAndUpdate(
      { userId: user.id },
      {
        "activity.lastLogin": nowInIST(), // Use IST time
        $push: {
          auditTrail: {
            action: "login",
            at: nowInIST(), // Use IST time
          },
        },
      },
    );
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store only the hash in the DB — raw token stays in the HttpOnly cookie.
  // If the DB is compromised, the hashes are useless without the raw tokens.
  user.refreshToken = hashToken(refreshToken);
  await user.save();

  // Send refresh token in HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: accessToken,
  };

  return successResponse(res, userResponse, "Login successful");
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return errorResponse(res, "User not found", 404);
  }

  let profileData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // If admin, include admin-specific details
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
});

export const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    // Query by hash — the DB never holds raw tokens
    await User.findOneAndUpdate(
      { refreshToken: hashToken(token) },
      { refreshToken: null },
    );
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return successResponse(res, null, "Logged out successfully");
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return errorResponse(res, "No refresh token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== hashToken(token)) {
      return errorResponse(res, "Invalid refresh token", 401);
    }

    const newAccessToken = generateAccessToken(user);

    return successResponse(
      res,
      { token: newAccessToken },
      "Access token refreshed",
    );
  } catch (error) {
    return errorResponse(res, "Refresh token expired or invalid", 401);
  }
});

// -----------------------------------Create Admin (Superadmin only)----------------------------------------
// This is the ONLY way to create a new admin account.
// Route: POST /api/admin/create-admin
// Access: Superadmin only (protected by authMiddleware + requireSuperadmin)

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, adminRole, department } = req.body;

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

  let permissions = {
    canApproveDoctors: false,
    canManageAdmins: false,
    canViewAnalytics: false,
    canSuspendAccounts: false,
  };
  if (selectedAdminRole === "superadmin") {
    permissions = {
      canApproveDoctors: true,
      canManageAdmins: true,
      canViewAnalytics: true,
      canSuspendAccounts: true,
    };
  } else if (selectedAdminRole === "verifier") {
    permissions.canApproveDoctors = true;
  } else if (selectedAdminRole === "support") {
    permissions.canViewAnalytics = true;
  }

  // Hash once here for the User record (User model has no pre-save hook)
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

    // Pass the RAW password to Admin.create — the Admin pre-save hook hashes it.
    // Do NOT pass hashedPassword here: the hook would hash an already-hashed value,
    // making Admin.security.passwordHash out of sync with User.password.
    // Both fields must hash the same original password to stay in sync.
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

    // Audit trail — outside the transaction so a logging failure doesn't
    // roll back the successfully created admin account
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
});
