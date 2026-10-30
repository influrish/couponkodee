/**
 * Stale-while-revalidate cache for public CMS reads on the storefront.
 *
 * - Fresh (under FRESH_MS): served from memory with no network call.
 * - Stale (under STALE_MS): served immediately while a background refresh
 *   fetches the latest data, so visitors almost never wait on the CMS. Stale
 *   data is also what keeps pages showing real content if the CMS is down.
 * - On Cloudflare, entries are also kept in the data center's shared cache
 *   (Cache API), so every Worker instance there benefits from one fetch.
 *   Elsewhere (Render, local dev, tests) only the in-memory layer is used.
 */

// Admin edits appear on the site within about a minute.
export const FRESH_MS = 60_000
// How long stale data may be shown while the CMS is slow, asleep or down.
export const STALE_MS = 24 * 60 * 60 * 1000
const MAX_MEMORY_ENTRIES = 200
const STORED_AT_HEADER = "X-Cms-Stored-At"

interface MemoryEntry {
  storedAt: number
  value: Promise<unknown>
  settled: boolean
  refreshing: boolean
}

const memory = new Map<string, MemoryEntry>()

type WaitUntil = (promise: Promise<unknown>) => void

/** Keeps background work alive after the response on Workers (set by OpenNext). */
function getWaitUntil(): WaitUntil | null {
  const context = (globalThis as Record<symbol, any>)[Symbol.for("__cloudflare-context__")]
  return typeof context?.ctx?.waitUntil === "function" ? context.ctx.waitUntil.bind(context.ctx) : null
}

function runInBackground(task: Promise<unknown>): void {
  getWaitUntil()?.(task)
}

function getSharedCache(): Cache | null {
  const cacheStorage = (globalThis as { caches?: CacheStorage & { default?: Cache } }).caches
  return cacheStorage?.default ?? null
}

async function readShared(key: string): Promise<{ storedAt: number; data: unknown } | null> {
  const cache = getSharedCache()
  if (!cache) return null
  try {
    const response = await cache.match(key)
    if (!response) return null
    const storedAt = Number(response.headers.get(STORED_AT_HEADER))
    if (!Number.isFinite(storedAt)) return null
    return { storedAt, data: await response.json() }
  } catch (err) {
    console.warn("CMS shared cache read failed:", err)
    return null
  }
}

async function writeShared(key: string, data: unknown, storedAt: number): Promise<void> {
  const cache = getSharedCache()
  if (!cache) return
  try {
    const response = new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${Math.floor(STALE_MS / 1000)}`,
        [STORED_AT_HEADER]: String(storedAt),
      },
    })
    await cache.put(key, response)
  } catch (err) {
    console.warn("CMS shared cache write failed:", err)
  }
}

function remember(key: string, entry: MemoryEntry, now: number): void {
  if (memory.size >= MAX_MEMORY_ENTRIES && !memory.has(key)) {
    for (const [entryKey, existing] of memory) {
      if (now - existing.storedAt >= STALE_MS) memory.delete(entryKey)
    }
    if (memory.size >= MAX_MEMORY_ENTRIES) memory.delete(memory.keys().next().value as string)
  }
  memory.set(key, entry)
}

/**
 * Loads a value that is not in memory: from the shared cache when it has one,
 * otherwise from the CMS (then shared). Registered before any await, so
 * simultaneous visitors share one request. Failures are not kept.
 */
function loadAndStore<T>(key: string, load: () => Promise<T>, now: number): Promise<T> {
  const entry: MemoryEntry = { storedAt: now, value: Promise.resolve(), settled: false, refreshing: false }

  const value = (async () => {
    const shared = await readShared(key)
    if (shared && now - shared.storedAt < STALE_MS) {
      entry.storedAt = shared.storedAt
      entry.settled = true
      if (now - shared.storedAt >= FRESH_MS) refreshInBackground(key, entry, load)
      return shared.data as T
    }

    const data = await load()
    entry.settled = true
    runInBackground(writeShared(key, data, now))
    return data
  })().catch((err) => {
    if (memory.get(key) === entry) memory.delete(key)
    throw err
  })

  entry.value = value
  remember(key, entry, now)
  return value
}

/** Refreshes a stale entry without making the current visitor wait; keeps the stale copy on failure. */
function refreshInBackground<T>(key: string, entry: MemoryEntry, load: () => Promise<T>): void {
  if (entry.refreshing) return
  entry.refreshing = true
  const refreshedAt = Date.now()
  const task = load().then(
    (data) => {
      remember(key, { storedAt: refreshedAt, value: Promise.resolve(data), settled: true, refreshing: false }, refreshedAt)
      return writeShared(key, data, refreshedAt)
    },
    (err) => {
      entry.refreshing = false
      console.warn(`CMS refresh failed; serving cached data for ${key}:`, err)
    },
  )
  runInBackground(task)
}

export function cachedRead<T>(key: string, load: () => Promise<T>): Promise<T> {
  const now = Date.now()

  const entry = memory.get(key)
  if (entry) {
    const age = now - entry.storedAt
    if (age < FRESH_MS || !entry.settled) return entry.value as Promise<T>
    if (age < STALE_MS) {
      refreshInBackground(key, entry, load)
      return entry.value as Promise<T>
    }
  }

  return loadAndStore(key, load, now)
}

export function clearCmsCache(): void {
  memory.clear()
}
