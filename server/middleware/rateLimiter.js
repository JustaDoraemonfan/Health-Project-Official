import rateLimit from "express-rate-limit";

// Helper that builds a consistent rate limit response
// so all rate limit errors look the same as your other errors
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many requests. Please wait a moment and try again.",
    retryAfter: Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000),
  });
};

// ── Login — brute force protection ──────────────────────────────────────────
// 10 attempts per 15 minutes per IP
// Generous enough for a real user who mistyped their password,
// but kills any automated attack script completely
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many login attempts. Please try again in 15 minutes.",
  standardHeaders: true, // sends RateLimit-* headers so the frontend knows
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: true, // only count failed attempts against the limit
});

// ── Register — spam / fake account protection ────────────────────────────────
// 20 registrations per hour per IP
// A real person would never register 20 accounts in an hour
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: "Too many accounts created. Please try again in an hour.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// ── Chat — Gemini API cost protection ────────────────────────────────────────
// 30 messages per minute per IP
// Each chat message calls Gemini 3 times — unthrottled abuse = big API bill.
// 30/min is generous for real conversation but stops hammering cold.
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: "Too many messages. Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// ── AI Analysis — Gemini cost protection ─────────────────────────────────────
// Symptom analyze + patient profile analyze both call Gemini once per request.
// 10 per minute per IP is generous for genuine clinical use but stops abuse.
export const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: "Too many analysis requests. Please wait a moment.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// ── General API — blanket abuse protection ───────────────────────────────────
// Applied to all /api/* routes as a last-resort ceiling.
// 200 requests per minute per IP covers any realistic user session
// (dashboard load fires ~6 requests, so 200 = ~33 full page loads/min)
// while blocking scrapers, enumeration attacks, and runaway clients.
// Route-specific limiters (login, chat, analyze) remain stricter on top of this.
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: (req) => req.method === "OPTIONS", // never block preflight requests
});
