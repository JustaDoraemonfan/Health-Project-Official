import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { uploadProfilePhoto } from "../config/s3.js";
import { uploadProfilePhotoController } from "../controllers/ProfilePhotoController.js";

const router = express.Router();

router.post(
  "/update",
  authMiddleware,
  authorizeRoles("doctor", "patient", "admin"),
  uploadProfilePhoto.single("photo"),
  uploadProfilePhotoController
);

export default router;
