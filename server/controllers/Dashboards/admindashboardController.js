import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import Admin from "../../models/Admin.js";

// Admin Dashboard
const getAdminDashboard = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ userId: req.user.id });
  if (!admin) {
    return errorResponse(res, "Admin record not found", 404);
  }

  return successResponse(res, {
    message: `Welcome to the admin dashboard, ${req.user.name}!`,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
    admin: {
      id: admin._id,
      department: admin.department,
    },
  });
});

export default getAdminDashboard;
