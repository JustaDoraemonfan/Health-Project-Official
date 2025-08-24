import express from "express";
import {
  createFWL,
  getAllFrontlineWorkers,
  getFrontlineWorkerById,
  deleteFrontlineWorker,
} from "../controllers/frontlineWorkerController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin can manage FWLs
router.post("/", authMiddleware, authorizeRoles("admin"), createFWL);
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  getAllFrontlineWorkers
);
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getFrontlineWorkerById
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteFrontlineWorker
);

export default router;
