import type { Metadata } from "next"
import Link from "next/link"
import { getStoreOffers } from "@/lib/stores-data"
import { getDbStores } from "@/lib/db-stores"
import { getPayloadClient } from "@/src/lib/payload"
import { getCashbackVisibility } from "@/lib/cms-settings"
import { Breadcrumb } from "@/components/breadcrumb"
import { DealsExplorer, DealOfferItem } from "@/components/deals-explorer"
import { getBrandLogo } from "@/lib/brand-logos"
import { StoreLogoImage } from "@/components/store-logo-image"
import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  HelpCircle,
  Flame,
  Scissors,
  ShieldCheck,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Best Trending Deals, Sales & Price Drops | CouponKodee",
  description:
    "Discover the biggest price drops, clearance sales, and limited-time deals from 500+ top Indian and global stores like Amazon, Myntra, Swiggy, and Flipkart.",
}

// ISR revalidation
export const revalidate = 60

export default async function DealsPage() {
  const isCashbackEnabled = await getCashbackVisibility()
  const stores = await getDbStores(isCashbackEnabled)

  // 1. Gather all store offers from static data
  const staticOffers: DealOfferItem[] = stores.flatMap((store) => {
    const offers = store.offers || getStoreOffers(store)
    return offers.map((offer) => ({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      merchant: store.name,
      merchantSlug: store.slug,
      code: offer.code,
      discount: offer.discount,
      type: offer.type,
      affiliateUrl: offer.affiliateUrl,
      isVerified: offer.isVerified,
      category: store.category,
      countries: offer.countries || store.countries,
    }))
  })

  // 2. Fetch any database products/deals from Payload (if active)
  let dbOffers: DealOfferItem[] = []
  try {
    const payload = await getPayloadClient()
    const productsResult = await payload.find({
      collection: "products",
      where: { "status.isActive": { equals: true } },
      limit: 50,
      sort: ["-status.isFeatured", "-createdAt"],
    })

    dbOffers = productsResult.docs.map((p: any) => ({
      id: String(p.id),
      title: p.title,
      description: p.shortDescription,
      merchant: p.merchant || "Featured Store",
      merchantSlug: (p.merchant || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
      discount: p.pricing?.discountPercentage ? `${p.pricing.discountPercentage}% OFF` : "Deal",
      type: "deal" as const,
      affiliateUrl: p.affiliateUrl || "https://google.com",
      isVerified: Boolean(p.status?.isVerified ?? true),
      category: typeof p.category === "object" ? p.category?.slug : p.category || "electronics",
      countries: Array.isArray(p.countries) && p.countries.length > 0 ? p.countries : ["IN"],
    }))
  } catch {
    // fallback to static offers
  }

  // Combine and deduplicate
  const seenDeals = new Set<string>()
  const allOffers: DealOfferItem[] = []

  for (const d of dbOffers) {
    const key = `${(d.merchantSlug || d.merchant).toLowerCase()}::${d.title.toLowerCase()}`
    seenDeals.add(key)
    allOffers.push(d)
  }

  for (const d of staticOffers) {
    const key = `${(d.merchantSlug || d.merchant).toLowerCase()}::${d.title.toLowerCase()}`
    if (!seenDeals.has(key)) {
      seenDeals.add(key)
      allOffers.push(d)
    }
  }

  // Extract popular stores for the top strip
  const popularStores = stores.filter((s) => s.isPopular).slice(0, 8)

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Deals", href: "/deals" },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <section className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-black uppercase tracking-wider mb-3">
            <Flame className="h-3.5 w-3.5" />
            Top Price Drops &amp; Offers
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Trending Deals &amp; Daily Price Drops
          </h1>
          <p className="mt-2 text-[15.5px] text-slate-700 leading-relaxed">
            The biggest discounts and clearance deals across top retailers. No promo codes required — just click &ldquo;Get Deal&rdquo; for instant price reductions.
          </p>
        </section>

        {/* Popular Stores Quick Strip */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular Stores for Deals:
            </span>
            <Link
              href="/stores"
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              <span>All Stores</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {popularStores.map((store) => {
              const logo = store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name)
              return (
                <Link
                  key={store.slug}
                  href={`/store/${store.slug}`}
                  className="group flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all text-center justify-between"
                >
                  {/* MOBILE LAYOUT (< 640px) */}
                  <div className="sm:hidden flex flex-col items-center justify-between text-center w-full gap-2 py-1">
                    {/* Top: Full brand name with verified badge */}
                    <div className="flex items-center justify-center gap-1.5 w-full">
                      <span className="font-extrabold text-[15px] text-slate-900 group-hover:text-purple-700 transition-colors text-center leading-snug break-words">
                        {store.name}
                      </span>
                      <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    </div>

                    {/* Below: Brand logo */}
                    <div className="h-[52px] w-[52px] rounded-xl overflow-hidden shadow-2xs flex items-center justify-center my-0.5 bg-white border border-slate-200/80 p-1">
                      <StoreLogoImage
                        src={logo}
                        alt={store.name}
                        initial={store.initial}
                        bg={store.bg}
                        size="md"
                      />
                    </div>

                    {/* Below the logo: Offers count, such as "2 Offers" */}
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                      2 Offers
                    </span>
                  </div>

                  {/* DESKTOP / TABLET LAYOUT (>= 640px) UNCHANGED */}
                  <div className="hidden sm:flex flex-col items-center w-full">
                    <StoreLogoImage
                      src={logo}
                      alt={store.name}
                      initial={store.initial}
                      bg={store.bg}
                      size="md"
                      className="mb-2 group-hover:scale-105 transition-transform"
                    />
                    <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 truncate w-full">
                      {store.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 mt-0.5">
                      {(() => {
                        const count = store.offers ? store.offers.length : (store.couponsCount ?? 0)
                        return `${count} ${count === 1 ? "offer" : "offers"}`
                      })()}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Interactive Deals & Coupons Explorer */}
        <DealsExplorer
          initialOffers={isCashbackEnabled ? allOffers : allOffers.filter((o) => o.type !== "cashback")}
          stores={stores.map((s) => ({
            name: s.name,
            slug: s.slug,
            initial: s.initial,
            bg: s.bg,
            offersCount: s.offers ? s.offers.length : (s.couponsCount ?? 0),
            countries: s.countries,
          }))}
        />

        {/* SEO & Redemption Guide */}
        <section className="mt-16 pt-10 border-t border-slate-200">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
              How to Save with CouponKodee Deals &amp; Promo Codes
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed mb-6">
              Online shopping is always cheaper when you know where to look. At CouponKodee, our automated systems and deal curation team scan over 500 partner retailers 24 hours a day to test and verify every promo code.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Scissors className="h-4 w-4 text-purple-600" />
                  <span>1. Copy Verified Code</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click any coupon offer to copy the discount code to your clipboard.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>2. Redirect &amp; Shop</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The retailer website opens automatically in a new tab with tracked savings.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <CircleDollarSign className="h-4 w-4 text-blue-600" />
                  <span>3. Paste &amp; Save</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isCashbackEnabled
                    ? "Paste code at checkout for immediate discounts and earn extra cashback."
                    : "Paste code at checkout for immediate discounts and maximum savings."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
