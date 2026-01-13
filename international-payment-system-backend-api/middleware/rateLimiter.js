const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

// Helper: generate safe IP-based key
const keyByIp = (req) =>
  ipKeyGenerator(
    req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.connection?.remoteAddress ||
      "unknown"
  );

// --- Registration limiter ---
// Tight limits for registrations to prevent abuse
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByIp,
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many registration attempts from this IP. Try again later.",
    });
  },
});

// --- Login limiter ---
// Combines IP + account/email tracking, skip successful attempts
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 failed attempts per IP+email
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    // Use accountNumber (or email if you prefer) + IP to limit attempts
    const account = (req.body?.accountNumber || "").trim();
    return `${keyByIp(req)}:${account}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many login attempts. Please try again later.",
    });
  },
});

module.exports = { loginLimiter, registerLimiter };