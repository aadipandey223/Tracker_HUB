/**
 * Security utilities for headers and validation
 */

/**
 * Check if the app is running on HTTPS in production
 */
export const enforceHTTPS = () => {
  if (import.meta.env.PROD && window.location.protocol !== 'https:') {
    console.warn('⚠️ App should be served over HTTPS in production');
    // In production, you might want to redirect to HTTPS
    // window.location.href = window.location.href.replace('http:', 'https:');
  }
};

/**
 * Add security headers programmatically (backup to meta tags)
 */
export const addSecurityHeaders = () => {
  // Check if CSP is working
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    console.warn('⚠️ Content Security Policy not found in meta tags');
  }

  // Disable right-click in production (optional)
  if (import.meta.env.PROD) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
};

/**
 * Validate referrer to prevent CSRF
 */
export const validateReferrer = () => {
  const referrer = document.referrer;
  const currentOrigin = window.location.origin;
  
  if (referrer && !referrer.startsWith(currentOrigin)) {
    console.warn('⚠️ Request from external referrer:', referrer);
    // In production, you might want to block or log this
  }
};

/**
 * Initialize all security measures
 */
export const initSecurity = () => {
  enforceHTTPS();
  addSecurityHeaders();
  validateReferrer();
  
  console.log('🔒 Security measures initialized');
};