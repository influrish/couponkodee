/**
 * Accepts only same-site relative paths for post-login redirects, so
 * `?redirect=https://evil.example` or `//evil.example` cannot send users off-site.
 */
export function safeRedirectPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/")) return fallback
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback
  if (/[\u0000-\u001f]/.test(value)) return fallback
  return value
}
