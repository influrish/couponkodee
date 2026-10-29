/**
 * Read-only Payload client backed by the CMS server's public REST API.
 *
 * Used when the storefront runs on Cloudflare Workers, which cannot hold a
 * MongoDB connection. The admin and database live on the CMS server (CMS_URL);
 * storefront pages keep calling `payload.find` / `payload.findGlobal` and get
 * the same response shapes over HTTPS. Only publicly readable data is fetched,
 * apart from `auth`, which asks the CMS who the visitor's own cookie belongs to.
 */

const REQUEST_TIMEOUT_MS = 10_000
// Matches the storefront pages' revalidate window; admin edits show within a minute.
const CACHE_TTL_MS = 60_000
const CACHE_MAX_ENTRIES = 200

const responseCache = new Map<string, { expiresAt: number; value: Promise<unknown> }>()

/** Shares public reads for CACHE_TTL_MS so each page view doesn't wait on the CMS. */
function cached<T>(key: string, load: () => Promise<T>, now = Date.now()): Promise<T> {
  const hit = responseCache.get(key)
  if (hit && hit.expiresAt > now) return hit.value as Promise<T>

  if (responseCache.size >= CACHE_MAX_ENTRIES) {
    for (const [entryKey, entry] of responseCache) {
      if (entry.expiresAt <= now) responseCache.delete(entryKey)
    }
    if (responseCache.size >= CACHE_MAX_ENTRIES) responseCache.clear()
  }

  const value = load()
  responseCache.set(key, { expiresAt: now + CACHE_TTL_MS, value })
  // Failures are not cached, so the next request retries the CMS.
  value.catch(() => responseCache.delete(key))
  return value
}

export function clearCmsResponseCache(): void {
  responseCache.clear()
}

type QueryValue = string | number | boolean | null | undefined | QueryValue[] | { [key: string]: QueryValue }

export interface RestFindArgs {
  collection: string
  where?: Record<string, QueryValue>
  limit?: number
  sort?: string
  depth?: number
  page?: number
}

export interface RestFindGlobalArgs {
  slug: string
  depth?: number
}

export interface RestFindResult<T = any> {
  docs: T[]
  totalDocs: number
  limit: number
  page?: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/** Serializes nested objects the way Payload's REST API expects: where[a][equals]=b */
export function toQueryString(params: Record<string, QueryValue>): string {
  const pairs: string[] = []

  const append = (key: string, value: QueryValue) => {
    if (value === undefined) return
    if (Array.isArray(value)) {
      value.forEach((item, index) => append(`${key}[${index}]`, item))
    } else if (value !== null && typeof value === "object") {
      for (const [childKey, childValue] of Object.entries(value)) append(`${key}[${childKey}]`, childValue)
    } else {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value === null ? "null" : String(value))}`)
    }
  }

  for (const [key, value] of Object.entries(params)) append(key, value)
  return pairs.join("&")
}

export function getCmsUrl(): string | null {
  const url = (process.env.CMS_URL || "").trim().replace(/\/+$/, "")
  return /^https?:\/\//.test(url) ? url : null
}

async function getJson<T>(
  baseUrl: string,
  path: string,
  query: Record<string, QueryValue>,
  extraHeaders: Record<string, string> = {},
): Promise<T> {
  const queryString = toQueryString(query)
  const url = `${baseUrl}/api/${path}${queryString ? `?${queryString}` : ""}`
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...extraHeaders },
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status} ${response.statusText} for /api/${path}`)
  }
  return (await response.json()) as T
}

export function createRestPayloadClient(baseUrl: string) {
  return {
    find<T = any>({ collection, where, limit, sort, depth, page }: RestFindArgs): Promise<RestFindResult<T>> {
      const path = encodeURIComponent(collection)
      const query = { where, limit, sort, depth, page }
      return cached(`${baseUrl}|${path}|${toQueryString(query)}`, () => getJson(baseUrl, path, query))
    },
    findGlobal<T = any>({ slug, depth }: RestFindGlobalArgs): Promise<T> {
      const path = `globals/${encodeURIComponent(slug)}`
      return cached(`${baseUrl}|${path}|${depth ?? ""}`, () => getJson(baseUrl, path, { depth }))
    },
    /** Resolves the signed-in user from the visitor's own session cookie. */
    async auth({ headers }: { headers: Headers }): Promise<{ user: { id: string } | null }> {
      const cookie = headers.get("cookie")
      if (!cookie) return { user: null }
      const { user } = await getJson<{ user: { id: string } | null }>(baseUrl, "users/me", {}, { Cookie: cookie })
      return { user: user ?? null }
    },
  }
}

export type RestPayloadClient = ReturnType<typeof createRestPayloadClient>
