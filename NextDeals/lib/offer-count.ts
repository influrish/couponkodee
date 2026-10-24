interface CountableStore {
  offers?: unknown[] | null
  couponsCount?: number | null
}

/** Number of live offers for a store: its loaded offers, else the stored count. */
export function getOfferCount(store: CountableStore): number {
  return store.offers ? store.offers.length : (store.couponsCount ?? 0)
}

/** "1 Offer" / "3 Offers" (pass a custom noun such as "live offer"). */
export function formatOfferCount(count: number, noun = "Offer"): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`
}
