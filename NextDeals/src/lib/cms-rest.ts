/**
 * Read-only Payload client backed by the CMS server's public REST API.
 *
 * Used when the storefront runs on Cloudflare Workers, which cannot hold a
 * MongoDB connection. The admin and database live on the CMS server (CMS_URL);
 * storefront pages keep calling `payload.find` / `payload.findGlobal` and get
 * the same response shapes over HTTPS. Only publicly readable data is fetched,
 * apart from `auth`, which asks the CMS who the visitor's own cookie belongs to.
 * Public reads go through cms-cache.ts, so most page views never wait on the CMS.
 */

import { cachedRead } from "./cms-cache"

const REQUEST_TIMEOUT_MS = 10_000

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

function buildUrl(baseUrl: string, path: string, query: Record<string, QueryValue>): string {
  const queryString = toQueryString(query)
  return `${baseUrl}/api/${path}${queryString ? `?${queryString}` : ""}`
}

async function getJson<T>(url: string, extraHeaders: Record<string, string> = {}): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...extraHeaders },
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status} ${response.statusText} for ${new URL(url).pathname}`)
  }
  return (await response.json()) as T
}

export function createRestPayloadClient(baseUrl: string) {
  return {
    find<T = any>({ collection, where, limit, sort, depth, page }: RestFindArgs): Promise<RestFindResult<T>> {
      const url = buildUrl(baseUrl, encodeURIComponent(collection), { where, limit, sort, depth, page })
      return cachedRead(url, () => getJson(url))
    },
    findGlobal<T = any>({ slug, depth }: RestFindGlobalArgs): Promise<T> {
      const url = buildUrl(baseUrl, `globals/${encodeURIComponent(slug)}`, { depth })
      return cachedRead(url, () => getJson(url))
    },
    /** Resolves the signed-in user from the visitor's own session cookie. */
    async auth({ headers }: { headers: Headers }): Promise<{ user: { id: string } | null }> {
      const cookie = headers.get("cookie")
      if (!cookie) return { user: null }
      const { user } = await getJson<{ user: { id: string } | null }>(buildUrl(baseUrl, "users/me", {}), { Cookie: cookie })
      return { user: user ?? null }
    },
  }
}

export type RestPayloadClient = ReturnType<typeof createRestPayloadClient>
