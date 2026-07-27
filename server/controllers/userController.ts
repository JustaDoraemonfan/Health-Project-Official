import type { Request, Response } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";
import type { Types } from "mongoose";
//Models
import User, { type UserRole, UserDocument } from "../Models/User.js";
import Patient, { type PatientDocument } from "../Models/Patient.js";
import Doctor, { type DoctorDocument } from "../Models/Doctor.js";
import Admin, { type AdminDocument } from "../Models/Admin.js";

//Midlleware
import asyncHandler from "../middleware/asyncHandler.js";

//Utils
import { successResponse, errorResponse } from "../utils/response.js";
import { nowInIST } from "../utils/dateUtils.js";

//Interface
import { type CurrentUserResponse } from "../types/response.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return errorResponse(res, "User not found", 401);
  }
  const userId = req.user._id;
  const userRole = req.user.role;
  const userData: CurrentUserResponse = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };
});
