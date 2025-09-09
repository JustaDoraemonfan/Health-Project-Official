// services/earthquakeService.js
import axios from "axios";
import https from "https";
import Earthquake from "../models/Earthquake.js";

const USGS_FEED =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Approximate bounding box for India
const INDIA_BOUNDS = {
  minLat: 6.75, // southern tip
  maxLat: 35.5, // northern tip
  minLng: 68.0, // western tip
  maxLng: 97.5, // eastern tip
};

// Helper to process and save earthquakes
async function processEarthquakeFeatures(features) {
  // Filter only earthquakes inside India
  const indiaFeatures = features.filter((f) => {
    const coords = (f.geometry && f.geometry.coordinates) || [];
    const lng = coords[0];
    const lat = coords[1];

    return (
      lng >= INDIA_BOUNDS.minLng &&
      lng <= INDIA_BOUNDS.maxLng &&
      lat >= INDIA_BOUNDS.minLat &&
      lat <= INDIA_BOUNDS.maxLat
    );
  });

  for (const f of indiaFeatures) {
    const id = f.id; // USGS unique event ID
    const props = f.properties || {};
    const coords = (f.geometry && f.geometry.coordinates) || []; // [lng, lat, depth]

    const quakeDoc = {
      usgsId: id,
      place: props.place || "Unknown location",
      magnitude: props.mag ?? null,
      time: props.time ? new Date(props.time) : new Date(),
      depth: coords[2] ?? null,
      url: props.url || "",
      location: {
        type: "Point",
        coordinates: [coords[0] ?? 0, coords[1] ?? 0], // [lng, lat]
      },
      raw: f,
    };

    // Upsert to prevent duplicates
    await Earthquake.updateOne(
      { usgsId: id },
      { $set: quakeDoc },
      { upsert: true }
    );
  }

  return indiaFeatures.length;
}

export async function fetchEarthquakeData() {
  try {
    // 🔹 Axios + relaxed TLS
    const agent = new https.Agent({ rejectUnauthorized: false });
    const { data } = await axios.get(USGS_FEED, {
      timeout: 15000,
      httpsAgent: agent,
    });

    const features = data.features || [];
    const count = await processEarthquakeFeatures(features);
    console.log(
      `✅ [Axios] Earthquake fetch complete: ${count} events in India processed.`
    );
    return count;
  } catch (err) {
    console.warn("⚠️ Axios failed, falling back to node-fetch:", err.message);
  }
}
