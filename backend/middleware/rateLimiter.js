/**
 * In-memory rate limiter middleware.
 * No external dependencies — stores request counts in a Map with automatic cleanup.
 *
 * @param {number} maxAttempts - Maximum requests allowed per window (default: 5)
 * @param {number} windowMs - Time window in milliseconds (default: 15 minutes)
 */
export function rateLimiter(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const attempts = new Map()

  // Periodically clean up expired entries to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of attempts) {
      if (now - entry.startTime > windowMs) {
        attempts.delete(key)
      }
    }
  }, windowMs)

  // Allow the timer to not keep the process alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref()
  }

  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown'
    const now = Date.now()

    const entry = attempts.get(ip)

    if (!entry || now - entry.startTime > windowMs) {
      // First request or window expired — start a new window
      attempts.set(ip, { count: 1, startTime: now })
      return next()
    }

    if (entry.count >= maxAttempts) {
      const retryAfter = Math.ceil((entry.startTime + windowMs - now) / 1000)
      res.set('Retry-After', String(retryAfter))
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
        retryAfterSeconds: retryAfter,
      })
    }

    entry.count++
    next()
  }
}
