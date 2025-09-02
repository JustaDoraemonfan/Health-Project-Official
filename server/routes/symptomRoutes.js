import express from "express";
import {
  addSymptom,
  updateSymptom,
  getSymptoms,
  getSymptomById,
  deleteSymptom,
} from "../controllers/symptomController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Patient routes
 * All routes require authentication
 */
router.use(authMiddleware);

// ➕ Add new symptom | 👤 Patient only
router.post("/", authorizeRoles("patient"), addSymptom);

// ✏️ Update symptom by ID | 👤 Patient only
router.put("/:id", authorizeRoles("patient"), updateSymptom);

// 📋 Get all symptoms for logged-in patient | 👤 Patient only
router.get("/", authorizeRoles("patient"), getSymptoms);

// 🔍 Get single symptom by ID | 👤 Patient only
router.get("/:id", authorizeRoles("patient"), getSymptomById);

// ❌ Delete symptom by ID | 👤 Patient only
router.delete("/:id", authorizeRoles("patient"), deleteSymptom);

export default router;
