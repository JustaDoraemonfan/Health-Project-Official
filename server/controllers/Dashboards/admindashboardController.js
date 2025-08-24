import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse } from "../../utils/response.js";

// Admin Dashboard
const getAdminDashboard = asyncHandler(async (req, res) => {
  return successResponse(res, {
    message: `Welcome to the admin panel, ${req.user.name}!`,
    role: req.user.role,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
export default getAdminDashboard;
