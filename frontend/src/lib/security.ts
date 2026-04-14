/**
 * Input sanitization utilities to mitigate XSS / injection (OWASP T01/T09)
 */
export function sanitizeInput(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export function isTokenExpiringSoon(expiryMs: number | null, thresholdMs = 2 * 60 * 1000): boolean {
  if (!expiryMs) return false;
  return expiryMs - Date.now() <= thresholdMs;
}
