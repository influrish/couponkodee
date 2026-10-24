/**
 * Builds the affiliate redirect for the /out tracking route.
 * See "Outbound Click & Referral Routing" in the project handoff.
 */

export const DEFAULT_SUBID = "couponkodee"

const MAX_PARAM_LENGTH = 100

export interface OutboundParams {
  merchant?: string | null
  subid?: string | null
  code?: string | null
}

export function normalizeMerchantSlug(merchant?: string | null): string {
  return (merchant || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_PARAM_LENGTH)
}

function sanitizeParam(value?: string | null): string {
  return (value || "").trim().replace(/[^\w.@+-]/g, "").slice(0, MAX_PARAM_LENGTH)
}

export function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "")
}

export function hostFromUrl(url?: string | null): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? normalizeHost(parsed.hostname) : null
  } catch {
    return null
  }
}

/** True when the host equals an allowed host or is one of its subdomains. */
export function isAllowedHost(hostname: string, allowedHosts: ReadonlySet<string>): boolean {
  const host = normalizeHost(hostname)
  for (const allowed of allowedHosts) {
    if (host === allowed || host.endsWith(`.${allowed}`)) return true
  }
  return false
}

/**
 * Returns the merchant URL with tracking parameters attached,
 * or null when the target is missing or not an http(s) URL.
 */
export function buildAffiliateRedirectUrl(target: string | null | undefined, params: OutboundParams): URL | null {
  if (!target) return null

  let url: URL
  try {
    url = new URL(target)
  } catch {
    return null
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null

  const merchant = normalizeMerchantSlug(params.merchant) || "store"
  const code = sanitizeParam(params.code)

  url.searchParams.set("utm_source", "couponkodee")
  url.searchParams.set("utm_medium", "affiliate")
  url.searchParams.set("utm_campaign", `${merchant}_deal`)
  url.searchParams.set("subid", sanitizeParam(params.subid) || DEFAULT_SUBID)
  if (code) url.searchParams.set("coupon", code)

  return url
}
