// controllers/earthquakeController.js
import Earthquake from "../models/Earthquake.js";
import { fetchEarthquakeData } from "../services/earthquakeService.js";

// Trigger fetch manually
export async function refreshEarthquakeData(req, res) {
  try {
    const count = await fetchEarthquakeData();
    res.json({ message: "✅ Earthquake data refreshed", count });
  } catch (error) {
    console.error("❌ Error refreshing earthquake data:", error.message);
    res.status(500).json({ message: "Failed to refresh earthquake data" });
  }
}

// Get recent earthquakes (latest 20 by default)
export async function getEarthquakesController(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const recent = await Earthquake.find().sort({ time: -1 }).limit(limit);
    res.json(recent);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch earthquakes" });
  }
}

// Get earthquake by USGS ID
export async function getEarthquakeByIdController(req, res) {
  try {
    const quake = await Earthquake.findOne({ usgsId: req.params.id });
    if (!quake) return res.status(404).json({ message: "Not found" });
    res.json(quake);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch earthquake" });
  }
}

// Get earthquakes in a date range
export async function getEarthquakesByRangeController(req, res) {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates required" });
    }

    const quakes = await Earthquake.find({
      time: { $gte: new Date(start), $lte: new Date(end) },
    }).sort({ time: -1 });

    res.json(quakes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch earthquakes by range" });
  }
}

// Get significant earthquakes above minMag
export async function getSignificantEarthquakesController(req, res) {
  try {
    const minMag = parseFloat(req.query.minMag) || 5.0;
    const quakes = await Earthquake.find({ magnitude: { $gte: minMag } }).sort({
      magnitude: -1,
    });

    res.json(quakes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch significant earthquakes" });
  }
}
