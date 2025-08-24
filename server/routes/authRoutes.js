import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// Get current user profile
router.get("/me", authMiddleware, getCurrentUser);

export default router;
