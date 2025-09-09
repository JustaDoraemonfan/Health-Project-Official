import express from "express";
import {
  refreshEarthquakeData,
  getEarthquakesController,
  getEarthquakesByRangeController,
  getSignificantEarthquakesController,
  getEarthquakeByIdController,
} from "../controllers/earthquakeController.js";

const router = express.Router();

// Trigger fetch manually
router.post("/fetch", refreshEarthquakeData);

// Get all recent earthquakes
router.get("/", getEarthquakesController);

// Get earthquakes by date range
router.get("/range", getEarthquakesByRangeController);

// Get significant earthquakes
router.get("/significant", getSignificantEarthquakesController);

// Get earthquake by ID
router.get("/:id", getEarthquakeByIdController);

export default router;
