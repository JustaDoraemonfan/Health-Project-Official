import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { applyMiddleware } from "./middleware/index.js";
import { registerRoutes } from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  applyMiddleware(app);

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  registerRoutes(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
