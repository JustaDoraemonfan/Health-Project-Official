import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const NODE_ENV = process.env.NODE_ENV;

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://health-project-official-y3y6.vercel.app",
];

export function applyMiddleware(app) {
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) =>
        !origin || ALLOWED_ORIGINS.includes(origin)
          ? cb(null, true)
          : cb(new Error("CORS not allowed")),
      credentials: true,
    }),
  );
  if (NODE_ENV === "development") app.use(morgan("dev"));
}
