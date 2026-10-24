import type { StoreItem, StoreOffer } from "@/lib/stores-data"

/** Largest percentage saving across a store's offers, e.g. 60 for "Up to 60% Off". */
export function getBestPercentOff(offers: StoreOffer[]): number | null {
  let best: number | null = null
  for (const offer of offers) {
    for (const match of `${offer.discount} ${offer.title}`.matchAll(/(\d+(?:\.\d+)?)\s*%/g)) {
      const value = Number(match[1])
      if (value > 0 && value <= 100 && (best === null || value > best)) best = value
    }
  }
  return best
}

/** "October 2026": shoppers and search results favour visibly current coupon pages. */
export function currentMonthLabel(date = new Date()): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

/** Same brand in other regions: amazon -> amazon-us, amazon-uk; amazon-us -> amazon, amazon-uk. */
export function getRegionalSiblings(store: StoreItem, allStores: StoreItem[]): StoreItem[] {
  const brand = store.slug.split("-")[0]
  return allStores.filter((s) => s.slug !== store.slug && (s.slug === brand || s.slug.startsWith(`${brand}-`)))
}

export interface StoreFaq {
  question: string
  answer: string
}

/** FAQ answers built only from real store data (no invented statistics). */
export function buildStoreFaqs(store: StoreItem, offers: StoreOffer[], isCashbackEnabled: boolean): StoreFaq[] {
  const codes = offers.filter((o) => o.code)
  const best = getBestPercentOff(offers)
  const faqs: StoreFaq[] = [
    {
      question: `Are there any ${store.name} coupon codes available right now?`,
      answer:
        codes.length > 0
          ? `Yes. There ${codes.length === 1 ? "is 1 verified coupon code" : `are ${codes.length} verified coupon codes`} for ${store.name}, plus ${offers.length - codes.length} code-free ${offers.length - codes.length === 1 ? "deal" : "deals"}.${best ? ` The best saving is up to ${best}% off.` : ""}`
          : `There are no ${store.name} coupon codes right now, but ${offers.length} verified ${offers.length === 1 ? "deal is" : "deals are"} live and need no code.`,
    },
    {
      question: `How do I use a ${store.name} coupon code?`,
      answer: `Click "Show Code" on an offer. The code is copied and ${store.name} opens in a new tab. Paste the code into the promo or coupon box at checkout before paying.`,
    },
    {
      question: `Why didn't my ${store.name} code work?`,
      answer: `Most codes have conditions such as a minimum order value, eligible categories, or first-order-only use. Check the offer details, and make sure the code is applied before payment.`,
    },
  ]
  if (isCashbackEnabled && store.cashbackRate) {
    faqs.push({
      question: `Can I get cashback on ${store.name}?`,
      answer: `Yes, ${store.cashbackRate} on eligible orders. Activate cashback on this page before you shop; it usually tracks within 24 to 72 hours.`,
    })
  }
  return faqs
}
