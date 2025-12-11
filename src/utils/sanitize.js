import DOMPurify from 'dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [] 
  });
};

/**
 * Sanitize HTML content (for rich text)
 */
export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  });
};

/**
 * Validate and sanitize email
 */
export const sanitizeEmail = (email) => {
  const sanitized = sanitizeInput(email).toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : null;
};

/**
 * Sanitize number input
 */
export const sanitizeNumber = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};
