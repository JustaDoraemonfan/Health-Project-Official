// routes/reminderRoutes.js
import express from "express";
import {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  markAsTaken,
  markAsMissed, // <--- ADDED
  getReminderStats, // <--- ADDED
} from "../../controllers/Medication/reminderController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All reminder routes require authentication
router.use(authMiddleware);

// POST /api/reminders -> create a reminder
// GET /api/reminders -> get all reminders for logged-in user
router.route("/").post(createReminder).get(getReminders);

// GET /api/reminders/stats -> Get statistics
// !! This MUST come before the /:id route
router.get("/stats", getReminderStats); // <--- ADDED

// PUT /api/reminders/:id/mark-as-taken -> Mark as taken for today
router.route("/:id/mark-as-taken").put(markAsTaken);

// PUT /api/reminders/:id/mark-as-missed -> Mark as missed (date in body)
router.route("/:id/mark-as-missed").put(markAsMissed); // <--- ADDED

// GET /api/reminders/:id -> get single reminder
// PUT /api/reminders/:id -> update reminder
// DELETE /api/reminders/:id -> delete reminder
router
  .route("/:id")
  .get(getReminderById)
  .put(updateReminder)
  .delete(deleteReminder);

export default router;
