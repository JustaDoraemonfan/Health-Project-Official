import { Schema, model, type HydratedDocument, type Mixed } from "mongoose";

export interface Location {
  type: "Point";
  coordinates: number[];
}

export interface IEarthquake {
  usgsId: string;

  place?: string;

  magnitude?: number;

  time?: Date;

  depth?: number;

  url?: string;

  location: Location;

  raw?: Mixed;

  createdAt: Date;
}

export type EarthquakeDocument = HydratedDocument<IEarthquake>;

const earthquakeSchema = new Schema<IEarthquake>({
  usgsId: {
    type: String,
    unique: true,
    index: true,
  },

  place: String,

  magnitude: Number,

  time: Date,

  depth: Number,

  url: String,

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  },

  raw: {
    type: Schema.Types.Mixed,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

earthquakeSchema.index({
  location: "2dsphere",
});

const Earthquake = model<IEarthquake>("Earthquake", earthquakeSchema);

export default Earthquake;
