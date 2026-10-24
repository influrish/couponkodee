interface MergeableOffer {
  id: string
  merchantSlug?: string
  merchant?: string
}

/**
 * Merges offer lists in priority order (first list wins). An offer is dropped
 * when its id was already seen (the same DB record can arrive both directly and
 * via its store) or when it duplicates another offer's merchant + content.
 */
export function mergeOffers<T extends MergeableOffer>(lists: T[][], contentKey: (offer: T) => string): T[] {
  const seenIds = new Set<string>()
  const seenKeys = new Set<string>()
  const merged: T[] = []

  for (const list of lists) {
    for (const offer of list) {
      const merchantKey = String(offer.merchantSlug || offer.merchant || "").toLowerCase()
      const key = `${merchantKey}::${contentKey(offer).toLowerCase()}`
      if (seenIds.has(offer.id) || seenKeys.has(key)) continue
      seenIds.add(offer.id)
      seenKeys.add(key)
      merged.push(offer)
    }
  }

  return merged
}

/** Slug of a Payload relationship that may be populated (object) or just an id. */
export function relationSlug(relation: unknown): string | undefined {
  if (relation && typeof relation === "object" && "slug" in relation) {
    const slug = (relation as { slug?: unknown }).slug
    return typeof slug === "string" && slug ? slug : undefined
  }
  return undefined
}

export function slugifyMerchant(name?: string | null): string {
  return (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}
