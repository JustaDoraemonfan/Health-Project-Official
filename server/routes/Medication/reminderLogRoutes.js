import express from "express";
import {
  createReminderLog,
  getReminderLogs,
  getReminderLogById,
  updateReminderLog,
} from "../../controllers/Medication/reminderLogController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Protect all routes
router.use(authMiddleware);

// POST /api/reminder-logs -> create log (system or initial entry)
// GET /api/reminder-logs -> get all logs
router.route("/").post(createReminderLog).get(getReminderLogs);

// GET /api/reminder-logs/:id -> get single log
// PUT /api/reminder-logs/:id -> update status (taken/skipped)
router.route("/:id").get(getReminderLogById).put(updateReminderLog);

export default router;
