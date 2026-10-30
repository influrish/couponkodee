import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { FRESH_MS, STALE_MS, cachedRead, clearCmsCache } from "@/src/lib/cms-cache"

const KEY = "https://cms.test/api/stores?limit=1"

/** Lets background refresh promises settle. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe("cachedRead", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date("2026-10-30T10:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    clearCmsCache()
  })

  it("serves fresh data from memory without calling the CMS again", async () => {
    const load = vi.fn().mockResolvedValue("v1")

    expect(await cachedRead(KEY, load)).toBe("v1")
    vi.advanceTimersByTime(FRESH_MS - 1)
    expect(await cachedRead(KEY, load)).toBe("v1")

    expect(load).toHaveBeenCalledTimes(1)
  })

  it("shares one in-flight request between simultaneous visitors", async () => {
    const load = vi.fn().mockResolvedValue("v1")

    await Promise.all([cachedRead(KEY, load), cachedRead(KEY, load)])

    expect(load).toHaveBeenCalledTimes(1)
  })

  it("serves stale data instantly and refreshes it in the background", async () => {
    const load = vi.fn().mockResolvedValueOnce("v1").mockResolvedValueOnce("v2")
    await cachedRead(KEY, load)
    vi.advanceTimersByTime(FRESH_MS + 1)

    expect(await cachedRead(KEY, load)).toBe("v1")
    await flush()

    expect(load).toHaveBeenCalledTimes(2)
    expect(await cachedRead(KEY, load)).toBe("v2")
  })

  it("keeps serving the last good data when the CMS is down", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const load = vi.fn().mockResolvedValueOnce("v1").mockRejectedValue(new Error("CMS asleep"))
    await cachedRead(KEY, load)
    vi.advanceTimersByTime(FRESH_MS + 1)

    expect(await cachedRead(KEY, load)).toBe("v1")
    await flush()
    expect(await cachedRead(KEY, load)).toBe("v1")
  })

  it("does not keep failed first loads, so the next visitor retries", async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error("down")).mockResolvedValueOnce("v1")

    await expect(cachedRead(KEY, load)).rejects.toThrow("down")
    expect(await cachedRead(KEY, load)).toBe("v1")
  })

  it("fetches again once data is older than the stale limit", async () => {
    const load = vi.fn().mockResolvedValueOnce("v1").mockResolvedValueOnce("v2")
    await cachedRead(KEY, load)
    vi.advanceTimersByTime(STALE_MS + 1)

    expect(await cachedRead(KEY, load)).toBe("v2")
  })

  it("uses the Cloudflare shared cache when memory is empty", async () => {
    const store = new Map<string, Response>()
    const sharedCache = {
      match: vi.fn(async (key: string) => store.get(key)?.clone()),
      put: vi.fn(async (key: string, response: Response) => void store.set(key, response)),
    }
    vi.stubGlobal("caches", { default: sharedCache })
    const waitUntil = vi.fn()
    ;(globalThis as Record<symbol, unknown>)[Symbol.for("__cloudflare-context__")] = { ctx: { waitUntil } }

    try {
      await cachedRead(KEY, vi.fn().mockResolvedValue({ docs: ["costco"] }))
      await Promise.all(waitUntil.mock.calls.map(([task]) => task))
      expect(sharedCache.put).toHaveBeenCalledTimes(1)

      // Another Worker instance: empty memory, same data center cache
      clearCmsCache()
      const load = vi.fn()
      expect(await cachedRead(KEY, load)).toEqual({ docs: ["costco"] })
      expect(load).not.toHaveBeenCalled()
    } finally {
      delete (globalThis as Record<symbol, unknown>)[Symbol.for("__cloudflare-context__")]
    }
  })
})
