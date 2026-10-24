import { NextRequest, NextResponse } from "next/server"
import { getDbStores } from "@/lib/db-stores"
import { buildAffiliateRedirectUrl, hostFromUrl, isAllowedHost, normalizeMerchantSlug } from "@/lib/outbound-link"

export const dynamic = "force-dynamic"

/**
 * Hosts we are willing to redirect to: every store and offer URL known to the
 * CMS (or the static fallback), plus extra affiliate-network hosts from
 * OUTBOUND_ALLOWED_HOSTS. Anything else would make /out an open redirect.
 */
async function getAllowedHosts(): Promise<Set<string>> {
  const hosts = new Set<string>()
  const add = (url?: string | null) => {
    const host = hostFromUrl(url)
    if (host) hosts.add(host)
  }

  const stores = await getDbStores(true)
  for (const store of stores) {
    add(store.affiliateUrl)
    for (const offer of store.offers || []) add(offer.affiliateUrl)
  }

  for (const host of (process.env.OUTBOUND_ALLOWED_HOSTS || "").split(",")) {
    if (host.trim()) hosts.add(host.trim().toLowerCase().replace(/^www\./, ""))
  }

  return hosts
}

async function getSessionSubid(req: NextRequest): Promise<string | null> {
  if (!req.cookies.get("payload-token")) return null
  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: req.headers })
    return user ? String(user.id) : null
  } catch (err) {
    console.warn("Unable to resolve subid from session:", err)
    return null
  }
}

function redirect(location: string | URL, req: NextRequest) {
  const response = NextResponse.redirect(new URL(location, req.url), 307)
  response.headers.set("Cache-Control", "no-store")
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  return response
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const merchantSlug = normalizeMerchantSlug(params.get("merchant"))
  const fallback = merchantSlug ? `/store/${merchantSlug}` : "/"

  const target = buildAffiliateRedirectUrl(params.get("url"), {
    merchant: merchantSlug,
    code: params.get("code"),
    subid: params.get("subid") || (await getSessionSubid(req)),
  })

  if (!target) {
    return redirect(fallback, req)
  }

  const allowedHosts = await getAllowedHosts()
  if (!isAllowedHost(target.hostname, allowedHosts)) {
    console.warn(`Blocked outbound redirect to unknown host: ${target.hostname}`)
    return redirect(fallback, req)
  }

  return redirect(target, req)
}
