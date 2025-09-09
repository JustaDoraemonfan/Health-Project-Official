// models/Earthquake.js
import mongoose from "mongoose";

const EarthquakeSchema = new mongoose.Schema({
  usgsId: { type: String, unique: true, index: true }, // Unique ID from USGS
  place: String,
  magnitude: Number,
  time: Date,
  depth: Number,
  url: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  raw: { type: mongoose.Schema.Types.Mixed }, // optional raw event data
  createdAt: { type: Date, default: Date.now },
});

// Geo index for spatial queries (who’s inside earthquake zone?)
EarthquakeSchema.index({ location: "2dsphere" });

export default mongoose.model("Earthquake", EarthquakeSchema);
