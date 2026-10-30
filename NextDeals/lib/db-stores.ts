import { initialStores, getAllStores, StoreItem, StoreOffer, getStoreOffers, filterOffersByCashback, getStoreBySlug } from "@/lib/stores-data"
import { getBrandLogo } from "@/lib/brand-logos"
import { getStoreCountries } from "@/lib/countries-data"
import { getCashbackVisibility } from "@/lib/cms-settings"

export function getCategoryLabel(cat?: string): string {
  switch (cat) {
    case "fashion":
      return "Fashion & Apparel"
    case "electronics":
      return "Electronics"
    case "food":
      return "Food & Dining"
    case "travel":
      return "Travel & Flights"
    case "beauty":
      return "Beauty & Wellness"
    case "home":
      return "Home & Living"
    case "grocery":
      return "Grocery & Essentials"
    default:
      return "All Categories"
  }
}

/**
 * Fetch all active stores from MongoDB/Payload CMS with fallback to initialStores
 * Counts strictly match the actual number of valid, visible offers for each store.
 */
export async function getDbStores(isCashbackEnabled?: boolean): Promise<StoreItem[]> {
  if (typeof isCashbackEnabled === "undefined") {
    isCashbackEnabled = await getCashbackVisibility()
  }

  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "stores",
      where: {
        isActive: { equals: true },
      },
      limit: 300,
      sort: ["-sortOrder", "name"],
    })

    if (result.docs.length > 0) {
      // Fetch DB active offers to map exact counts
      const [couponDocs, productDocs, cashbackDocs] = await Promise.all([
        payload.find({ collection: "coupon-offers", where: { isActive: { equals: true } }, limit: 500 }).catch(() => ({ docs: [] })),
        payload.find({ collection: "products", where: { "status.isActive": { equals: true } }, limit: 500 }).catch(() => ({ docs: [] })),
        payload.find({ collection: "cashback-offers", where: { isActive: { equals: true } }, limit: 500 }).catch(() => ({ docs: [] })),
      ])

      const dbOffersBySlug = new Map<string, StoreOffer[]>()
      const addOfferToMap = (key: string, offer: StoreOffer) => {
        if (!key) return
        const list = dbOffersBySlug.get(key) || []
        list.push(offer)
        dbOffersBySlug.set(key, list)
      }

      for (const c of couponDocs.docs as any[]) {
        const slug = String(c.merchantSlug || "").toLowerCase().trim()
        const storeId = typeof c.store === "object" ? String(c.store?.id || c.store?._id || "") : String(c.store || "")
        const offer: StoreOffer = {
          id: String(c.id),
          title: c.title,
          description: c.description || undefined,
          code: c.code || undefined,
          discount: c.discount || "DEAL",
          type: "coupon",
          affiliateUrl: c.affiliateUrl || "",
          expiresAt: c.expiresAt ? String(c.expiresAt) : undefined,
          isVerified: Boolean(c.isVerified ?? true),
          countries: c.countries,
        }
        if (slug) addOfferToMap(slug, offer)
        if (storeId) addOfferToMap(`id:${storeId}`, offer)
      }

      for (const p of productDocs.docs as any[]) {
        const slug = String(p.merchant || "").toLowerCase().trim()
        const storeId = typeof p.store === "object" ? String(p.store?.id || p.store?._id || "") : String(p.store || "")
        const disc = p.pricing?.discountPercentage ? `${p.pricing.discountPercentage}% OFF` : "DEAL"
        const offer: StoreOffer = {
          id: String(p.id),
          title: p.title,
          description: p.shortDescription || undefined,
          discount: disc,
          type: "deal",
          affiliateUrl: p.affiliateUrl || "",
          isVerified: Boolean(p.status?.isVerified ?? true),
          countries: p.countries,
        }
        if (slug) addOfferToMap(slug, offer)
        if (storeId) addOfferToMap(`id:${storeId}`, offer)
      }

      for (const cb of cashbackDocs.docs as any[]) {
        const slug = String(cb.merchantSlug || "").toLowerCase().trim()
        const storeId = typeof cb.store === "object" ? String(cb.store?.id || cb.store?._id || "") : String(cb.store || "")
        const offer: StoreOffer = {
          id: String(cb.id),
          title: cb.title,
          description: cb.cashbackTerms || cb.description || undefined,
          discount: cb.cashbackRate || "CASHBACK",
          type: "cashback",
          affiliateUrl: cb.affiliateUrl || "",
          expiresAt: cb.expiresAt ? String(cb.expiresAt) : undefined,
          isVerified: Boolean(cb.isVerified ?? true),
          countries: cb.countries,
        }
        if (slug) addOfferToMap(slug, offer)
        if (storeId) addOfferToMap(`id:${storeId}`, offer)
      }

      const dbStores = result.docs.map((doc: any): StoreItem => {
        const storeSlug = String(doc.slug || "").toLowerCase().trim()
        const storeId = String(doc.id || doc._id || "")
        let logoUrl = ""
        if (typeof doc.customLogoUrl === "string" && doc.customLogoUrl.trim()) {
          logoUrl = doc.customLogoUrl.trim()
        } else if (typeof doc.logo === "object" && doc.logo?.url) {
          logoUrl = doc.logo.url
        } else if (typeof doc.logoUrl === "string" && doc.logoUrl.trim()) {
          logoUrl = doc.logoUrl.trim()
        } else {
          logoUrl = getBrandLogo(storeSlug) || getBrandLogo(doc.name) || ""
        }

        const rawStoreDbOffers = [
          ...(dbOffersBySlug.get(storeSlug) || []),
          ...(dbOffersBySlug.get(`id:${storeId}`) || []),
        ]
        const uniqueDbOffers: StoreOffer[] = []
        const seenOfferIds = new Set<string>()
        for (const o of rawStoreDbOffers) {
          if (!seenOfferIds.has(o.id)) {
            seenOfferIds.add(o.id)
            uniqueDbOffers.push(o)
          }
        }

        let storeOffers: StoreOffer[] = []
        if (uniqueDbOffers.length > 0) {
          storeOffers = [...uniqueDbOffers]
          if (isCashbackEnabled && doc.cashbackRate && !storeOffers.some((o) => o.type === "cashback")) {
            storeOffers.push({
              id: `${doc.id || storeSlug}-cb`,
              title: `Earn ${doc.cashbackRate} on All Valid Orders`,
              description: doc.cashbackTerms || `Activate cashback before shopping at ${doc.name} to receive real bank rewards.`,
              discount: doc.cashbackRate,
              type: "cashback",
              affiliateUrl: doc.affiliateUrl || "",
              isVerified: true,
              countries: Array.isArray(doc.countries) && doc.countries.length > 0 ? doc.countries : getStoreCountries(doc.slug),
            })
          }
        } else {
          const fallback = initialStores.find((s) => s.slug === storeSlug)
          if (fallback && fallback.offers && fallback.offers.length > 0) {
            storeOffers = fallback.offers
          } else {
            storeOffers = []
          }
        }

        const validOffers = filterOffersByCashback(storeOffers, isCashbackEnabled!)

        return {
          id: String(doc.id || doc.slug),
          name: doc.name,
          slug: doc.slug,
          category: doc.category || "electronics",
          categoryName: doc.categoryName || getCategoryLabel(doc.category),
          initial: doc.initial || doc.name.charAt(0).toUpperCase(),
          couponsCount: validOffers.length,
          cashbackRate: doc.cashbackRate || null,
          cashbackTerms: doc.cashbackTerms || undefined,
          isPopular: Boolean(doc.isPopular),
          hasCashback: Boolean(doc.hasCashback),
          hasCoupons: Boolean(doc.hasCoupons),
          isVerified: Boolean(doc.isVerified),
          affiliateUrl: doc.affiliateUrl,
          bg: doc.bg || "bg-slate-900",
          description: doc.description || "",
          logoUrl,
          countries: Array.isArray(doc.countries) && doc.countries.length > 0 ? doc.countries : getStoreCountries(doc.slug),
          offers: validOffers,
        }
      })

      return dbStores
    }
  } catch (err) {
    console.warn("Unable to fetch stores from DB, using fallback dataset:", err)
  }

  return getAllStores(isCashbackEnabled)
}

/**
 * Fetch a single store by slug and load its dynamic offers from MongoDB
 * Guarantees exact parity with getDbStores().
 */
export async function getDbStoreBySlug(slug: string, isCashbackEnabled?: boolean): Promise<StoreItem | undefined> {
  const normalized = slug.toLowerCase().trim()
  if (typeof isCashbackEnabled === "undefined") {
    isCashbackEnabled = await getCashbackVisibility()
  }

  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const storeResult = await payload.find({
      collection: "stores",
      where: {
        and: [
          {
            or: [
              { slug: { equals: normalized } },
              { slug: { equals: slug } },
            ],
          },
          { isActive: { equals: true } },
        ],
      },
      limit: 1,
    })

    if (storeResult.docs.length > 0) {
      const doc: any = storeResult.docs[0]
      const storeSlug = String(doc.slug || "").toLowerCase().trim()
      let logoUrl = ""
      if (typeof doc.customLogoUrl === "string" && doc.customLogoUrl.trim()) {
        logoUrl = doc.customLogoUrl.trim()
      } else if (typeof doc.logo === "object" && doc.logo?.url) {
        logoUrl = doc.logo.url
      } else if (typeof doc.logoUrl === "string" && doc.logoUrl.trim()) {
        logoUrl = doc.logoUrl.trim()
      } else {
        logoUrl = getBrandLogo(storeSlug) || getBrandLogo(doc.name) || ""
      }

      // Fetch dynamic offers from DB for this store
      const dbOffers: StoreOffer[] = []

      // Coupons, deals and cashback for this store, fetched in parallel
      const [couponResult, dealsResult, cashbackResult] = await Promise.all([
        payload.find({
          collection: "coupon-offers",
          where: {
            and: [
              {
                or: [
                  { merchantSlug: { equals: normalized } },
                  { store: { equals: doc.id } },
                ],
              },
              { isActive: { equals: true } },
            ],
          },
          limit: 50,
          sort: ["-sortOrder", "-createdAt"],
        }),
        payload.find({
          collection: "products",
          where: {
            and: [
              {
                or: [
                  { merchant: { equals: normalized } },
                  { store: { equals: doc.id } },
                ],
              },
              { "status.isActive": { equals: true } },
            ],
          },
          limit: 50,
          sort: "-createdAt",
        }),
        payload.find({
          collection: "cashback-offers",
          where: {
            and: [
              {
                or: [
                  { merchantSlug: { equals: normalized } },
                  { store: { equals: doc.id } },
                ],
              },
              { isActive: { equals: true } },
            ],
          },
          limit: 20,
          sort: ["-sortOrder", "-createdAt"],
        }),
      ])

      for (const c of couponResult.docs as any[]) {
        dbOffers.push({
          id: String(c.id),
          title: c.title,
          description: c.description || undefined,
          code: c.code || undefined,
          discount: c.discount || "DEAL",
          type: "coupon",
          affiliateUrl: c.affiliateUrl || doc.affiliateUrl,
          expiresAt: c.expiresAt ? String(c.expiresAt) : undefined,
          isVerified: Boolean(c.isVerified ?? true),
          countries: c.countries,
        })
      }

      for (const d of dealsResult.docs as any[]) {
        const disc = d.pricing?.discountPercentage ? `${d.pricing.discountPercentage}% OFF` : "DEAL"
        dbOffers.push({
          id: String(d.id),
          title: d.title,
          description: d.shortDescription || undefined,
          discount: disc,
          type: "deal",
          affiliateUrl: d.affiliateUrl || doc.affiliateUrl,
          isVerified: Boolean(d.status?.isVerified ?? true),
          countries: d.countries,
        })
      }

      for (const cb of cashbackResult.docs as any[]) {
        dbOffers.push({
          id: String(cb.id),
          title: cb.title,
          description: cb.cashbackTerms || cb.description || undefined,
          discount: cb.cashbackRate || doc.cashbackRate || "CASHBACK",
          type: "cashback",
          affiliateUrl: cb.affiliateUrl || doc.affiliateUrl,
          expiresAt: cb.expiresAt ? String(cb.expiresAt) : undefined,
          isVerified: Boolean(cb.isVerified ?? true),
          countries: cb.countries,
        })
      }

      let storeOffers: StoreOffer[] = []
      if (dbOffers.length > 0) {
        storeOffers = [...dbOffers]
        if (isCashbackEnabled && doc.cashbackRate && !storeOffers.some((o) => o.type === "cashback")) {
          storeOffers.push({
            id: `${doc.id || storeSlug}-cb`,
            title: `Earn ${doc.cashbackRate} on All Valid Orders`,
            description: doc.cashbackTerms || `Activate cashback before shopping at ${doc.name} to receive real bank rewards.`,
            discount: doc.cashbackRate,
            type: "cashback",
            affiliateUrl: doc.affiliateUrl,
            isVerified: true,
            countries: Array.isArray(doc.countries) && doc.countries.length > 0 ? doc.countries : getStoreCountries(doc.slug),
          })
        }
      } else {
        const fallback = initialStores.find((s) => s.slug === normalized)
        if (fallback && fallback.offers && fallback.offers.length > 0) {
          storeOffers = fallback.offers
        } else {
          storeOffers = []
        }
      }

      const validOffers = filterOffersByCashback(storeOffers, isCashbackEnabled!)

      return {
        id: String(doc.id || doc.slug),
        name: doc.name,
        slug: doc.slug,
        category: doc.category || "electronics",
        categoryName: doc.categoryName || getCategoryLabel(doc.category),
        initial: doc.initial || doc.name.charAt(0).toUpperCase(),
        couponsCount: validOffers.length,
        cashbackRate: doc.cashbackRate || null,
        cashbackTerms: doc.cashbackTerms || undefined,
        isPopular: Boolean(doc.isPopular),
        hasCashback: Boolean(doc.hasCashback),
        hasCoupons: Boolean(doc.hasCoupons),
        isVerified: Boolean(doc.isVerified),
        affiliateUrl: doc.affiliateUrl,
        bg: doc.bg || "bg-slate-900",
        description: doc.description || "",
        logoUrl,
        countries: Array.isArray(doc.countries) && doc.countries.length > 0 ? doc.countries : getStoreCountries(doc.slug),
        offers: validOffers,
      }
    }
  } catch (err) {
    console.warn("Unable to query store from DB:", err)
  }

  // Fallback to static stores list
  const fallbackStore = getStoreBySlug(normalized, isCashbackEnabled)
  if (fallbackStore) {
    return fallbackStore
  }

  return undefined
}

/**
 * Fetch popular stores for homepage, with strictly verified offer counts.
 */
export async function getDbPopularStores(isCashbackEnabled?: boolean): Promise<Array<{
  name: string
  slug: string
  initial: string
  offersCount: number
  cashback: string
  bg: string
  logoUrl?: string
}>> {
  if (typeof isCashbackEnabled === "undefined") {
    isCashbackEnabled = await getCashbackVisibility()
  }

  try {
    const allStores = await getDbStores(isCashbackEnabled)
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "stores",
      where: {
        and: [
          { isActive: { equals: true } },
          { isPopular: { equals: true } },
        ],
      },
      limit: 8,
      sort: ["-sortOrder", "name"],
    })

    if (result.docs.length > 0) {
      return result.docs.map((doc: any) => {
        const storeSlug = String(doc.slug || "").toLowerCase().trim()
        const matched = allStores.find((s) => s.slug === storeSlug)
        let logoUrl: string = getBrandLogo(storeSlug) || getBrandLogo(doc.name) || `/logos/${storeSlug}.svg`
        if (typeof doc.logo === "object" && doc.logo?.url) {
          logoUrl = doc.logo.url
        }

        const count = matched ? (matched.offers?.length ?? matched.couponsCount ?? 0) : 0

        return {
          name: doc.name,
          slug: doc.slug,
          initial: doc.initial || doc.name.charAt(0).toUpperCase(),
          offersCount: count,
          cashback: doc.cashbackRate || "Verified Savings",
          bg: doc.bg || "bg-slate-900",
          logoUrl,
        }
      })
    }
  } catch (err) {
    console.warn("Unable to query popular stores from DB:", err)
  }

  // Fallback default popular stores with exact real-world offer counts
  const allStores = await getDbStores(isCashbackEnabled)
  const popularSlugs = ["amazon", "flipkart", "myntra", "swiggy", "ajio", "nykaa", "makemytrip", "samsung"]

  return popularSlugs.map((slug) => {
    const store = allStores.find((s) => s.slug === slug)
    if (store) {
      return {
        name: store.name,
        slug: store.slug,
        initial: store.initial,
        offersCount: store.offers?.length ?? store.couponsCount ?? 0,
        cashback: store.cashbackRate || "Verified Savings",
        bg: store.bg,
        logoUrl: store.logoUrl,
      }
    }
    return {
      name: slug.toUpperCase(),
      slug,
      initial: slug.charAt(0).toUpperCase(),
      offersCount: 0,
      cashback: "Verified Savings",
      bg: "bg-purple-600",
    }
  })
}

/**
 * Fetch similar stores for store detail page, with exact matching counts
 */
export async function getDbSimilarStores(
  currentSlug: string,
  category: string,
  limit = 4,
  isCashbackEnabled?: boolean
): Promise<StoreItem[]> {
  const allStores = await getDbStores(isCashbackEnabled)
  return allStores
    .filter((s) => s.slug !== currentSlug && s.category === category)
    .slice(0, limit)
}

