import mongoose from "mongoose";
import FrontlineWorker from "../models/FWL.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Create frontline worker (admin or via signup)
export const createFWL = asyncHandler(async (req, res) => {
  const frontlineWorker = await FrontlineWorker.create(req.body);
  return successResponse(
    res,
    frontlineWorker,
    "Frontline Worker created successfully",
    201
  );
});

// Get all frontline workers
export const getAllFrontlineWorkers = asyncHandler(async (req, res) => {
  const fwls = await FrontlineWorker.find().lean();
  return successResponse(res, fwls, "Frontline Workers fetched successfully");
});

// Get a frontline worker by ID
export const getFrontlineWorkerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, "Invalid ID format", 400);
  }

  const fwl = await FrontlineWorker.findById(id).lean();
  if (!fwl) return errorResponse(res, "Frontline Worker not found", 404);

  return successResponse(res, fwl, "Frontline Worker fetched successfully");
});

// Delete a frontline worker
export const deleteFrontlineWorker = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, "Invalid ID format", 400);
  }

  const fwl = await FrontlineWorker.findByIdAndDelete(id);
  if (!fwl) return errorResponse(res, "Frontline Worker not found", 404);

  return successResponse(res, fwl, "Frontline Worker deleted successfully");
});
