import type { NextRequest } from "next/server"

/**
 * Fixed-window, in-memory rate limiter for public endpoints.
 * State is per server process (per isolate on Cloudflare), which is enough to
 * blunt scripted abuse locally and on a single node. Use a shared store
 * (e.g. Cloudflare Rate Limiting or Redis) if stricter guarantees are needed.
 */

interface Window {
  count: number
  resetAt: number
}

const buckets = new Map<string, Window>()
const MAX_TRACKED_KEYS = 10_000

export interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

export function checkRateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      for (const [k, w] of buckets) if (w.resetAt <= now) buckets.delete(k)
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  current.count += 1
  return {
    allowed: current.count <= limit,
    retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
  }
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

export function resetRateLimits() {
  buckets.clear()
}
