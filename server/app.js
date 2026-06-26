import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { applyMiddleware } from "./middleware/index.js";
import { registerRoutes } from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  applyMiddleware(app);

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Apply blanket rate limit to all API routes before any route handler runs.
  // Route-specific limiters (login, chat, analyze) remain stricter on top of this.
  app.use("/api", generalLimiter);

  registerRoutes(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
