import rateLimit, { type Options } from "express-rate-limit";
import type { Request, Response } from "express";

// Helper that builds a consistent rate limit response
const rateLimitHandler = (req: Request, res: Response): void => {
  const retryAfter = req.rateLimit.resetTime
    ? Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
    : undefined;

  res.status(429).json({
    success: false,
    message: "Too many requests. Please wait a moment and try again.",
    retryAfter,
  });
};

// Common options shared by all limiters
const commonOptions: Partial<Options> = {
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
};

// ── Login — brute force protection ───────
// 10 attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again in 15 minutes.",
  skipSuccessfulRequests: true,
});

// ── Register — spam / fake account protection
// 20 registrations per hour per IP
export const registerLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Too many accounts created. Please try again in an hour.",
});

// ── Chat — Gemini API cost protection ─────
// 30 messages per minute per IP
export const chatLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many messages. Please slow down.",
});

// ── AI Analysis — Gemini cost protection ──
// 10 analyses per minute per IP
export const analyzeLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many analysis requests. Please wait a moment.",
});

// ── General API — blanket abuse protection
// Applied to all /api/* routes as a last-resort ceiling.
export const generalLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * 1000,
  max: 200,
  skip: (req: Request): boolean => req.method === "OPTIONS",
});
