const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication endpoints (Login, Register, Password changes)
 * Mitigates brute-force attacks and credential stuffing.
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: process.env.NODE_ENV === 'test' ? 1000 : 20, // 20 attempts per 15 min in prod/dev
  standardHeaders: true, // Return standard rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skip: (req) => process.env.NODE_ENV === 'test', // Skip in automated test runner
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
      },
    });
  },
});

module.exports = {
  authRateLimiter,
};
