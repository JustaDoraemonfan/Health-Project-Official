import express from "express";
import {
  createNote,
  getPatientNotes,
  markNoteAsRead,
  acknowledgeNote,
  getDoctorNotes,
  updateNote,
  deleteNote,
} from "../controllers/NotesController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();
// Doctor creates notes
router.post("/", authMiddleware, authorizeRoles("doctor"), createNote);

// Patient views their notes
router.get("/", authMiddleware, authorizeRoles("patient"), getPatientNotes);

// Doctor views notes they created
router.get("/doctor", authMiddleware, authorizeRoles("doctor"), getDoctorNotes);

// Patient actions
router.patch(
  "/:id/read",
  authMiddleware,
  authorizeRoles("patient"),
  markNoteAsRead
);
router.patch(
  "/:id/acknowledge",
  authMiddleware,
  authorizeRoles("patient"),
  acknowledgeNote
);

// Doctor updates or deletes notes
router.put("/:id", authMiddleware, authorizeRoles("doctor"), updateNote);
router.delete("/:id", authMiddleware, authorizeRoles("doctor"), deleteNote);

export default router;
