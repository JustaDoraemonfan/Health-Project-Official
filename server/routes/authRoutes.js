import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerLimiter, registerUser);

// POST /api/auth/login
router.post("/login", loginLimiter, loginUser);

// Get current user profile
router.get("/me", authMiddleware, getCurrentUser);

router.post("/refresh-token", refreshAccessToken);

export default router;
