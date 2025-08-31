import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import FrontlineWorker from "../models/FWL.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Generate JWT
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
};

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
      400
    );
  }

  const validRoles = ["patient", "doctor", "frontlineWorker", "admin"];
  const userRole = role || "patient";
  if (!validRoles.includes(userRole)) {
    return errorResponse(
      res,
      `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      400
    );
  }

  // Check if user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return errorResponse(res, "User already exists", 409);
  }

  // Create User
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: userRole,
  });

  // Create role-specific record linked by userId
  if (userRole === "patient") {
    const { age, gender } = req.body;
    await Patient.create({
      userId: user.id,
      age: age ? parseInt(age) : null,
      gender: gender || "other",
      assignedDoctor: null,
    });
  } else if (userRole === "doctor") {
    const { phone, location, specialization } = req.body;
    await Doctor.create({
      userId: user.id,
      phone: phone,
      location: location,
      specialization: specialization || "",
      patients: [],
    });
  } else if (userRole === "frontlineWorker") {
    const { phone, location } = req.body;
    if (!phone || !location) {
      return errorResponse(
        res,
        "Phone number and location are required for frontline workers",
        400
      );
    }
    await FrontlineWorker.create({
      userId: user.id,
      phone,
      location,
    });
  }

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  };

  return successResponse(
    res,
    userResponse,
    "User registered successfully",
    201
  );
});

// Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const validationErrors = validateInput({ email, password });
  if (validationErrors.length > 0) {
    return errorResponse(res, "Validation failed", 400, validationErrors);
  }
  if (!isValidEmail(email)) {
    return errorResponse(res, "Invalid email format", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return errorResponse(res, "Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return errorResponse(res, "Invalid credentials", 401);
  }

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  };

  return successResponse(res, userResponse, "Login successful");
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return errorResponse(res, "User not found", 404);
  }

  return successResponse(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});
