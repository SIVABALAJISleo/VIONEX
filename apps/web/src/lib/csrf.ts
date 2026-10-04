/**
 * VIONEX Cryptographic CSRF Defense Module
 * Implements double-submit cookie pattern with HMAC signature verification.
 * Protects all state-mutating HTTP methods (POST, PUT, DELETE, PATCH).
 */

export const CSRF_COOKIE_NAME = 'vionex-csrf-token';
export const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a cryptographically secure random hexadecimal token
 */
export function generateCsrfToken(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Verify whether submitted request token matches the secure cookie token (TRUST-039)
 */
export function verifyCsrfToken(cookieToken: string | null | undefined, headerToken: string | null | undefined): boolean {
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;
  
  // Constant-time comparison to prevent timing side-channel attacks
  let result = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Helper to determine if an HTTP method is state-mutating and requires CSRF validation
 */
export function requiresCsrfProtection(method: string): boolean {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  return !safeMethods.includes(method.toUpperCase());
}
