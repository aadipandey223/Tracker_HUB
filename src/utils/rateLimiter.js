/**
 * Simple client-side rate limiter to prevent abuse
 * This is a basic protection - server-side rate limiting is still needed
 */
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  /**
   * Check if request is allowed
   * @param {string} key - Unique identifier (e.g., user ID, IP, action)
   * @param {number} maxRequests - Maximum requests allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {boolean} - True if request is allowed
   */
  isAllowed(key, maxRequests = 60, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests for this key
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const keyRequests = this.requests.get(key);

    // Remove old requests outside the window
    const validRequests = keyRequests.filter(timestamp => timestamp > windowStart);
    this.requests.set(key, validRequests);

    // Check if under limit
    if (validRequests.length >= maxRequests) {
      console.warn(`Rate limit exceeded for ${key}: ${validRequests.length}/${maxRequests} requests`);
      return false;
    }

    // Add current request
    validRequests.push(now);
    return true;
  }

  /**
   * Clear all rate limit data (useful for testing)
   */
  clear() {
    this.requests.clear();
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Rate limit decorator for API calls
 */
export const withRateLimit = (fn, key, maxRequests = 60, windowMs = 60000) => {
  return async (...args) => {
    if (!rateLimiter.isAllowed(key, maxRequests, windowMs)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    return fn(...args);
  };
};