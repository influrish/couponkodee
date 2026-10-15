import type { Metadata } from "next"
import Link from "next/link"
import { getStoreOffers } from "@/lib/stores-data"
import { getDbStores } from "@/lib/db-stores"
import { getCashbackVisibility } from "@/lib/cms-settings"
import { Breadcrumb } from "@/components/breadcrumb"
import { CouponsExplorer, CouponItem } from "@/components/coupons-explorer"
import { getBrandLogo } from "@/lib/brand-logos"
import { StoreLogoImage } from "@/components/store-logo-image"
import {
  ChevronRight,
  HelpCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Verified Coupons & Promo Codes | CouponKodee",
  description:
    "Find 100% verified coupon codes and promo vouchers for Amazon, Myntra, Swiggy, Flipkart, and 500+ top online stores. Copy codes with 1 click and save instantly.",
}

// ISR revalidation
export const revalidate = 60

export default async function CouponsPage() {
  const isCashbackEnabled = await getCashbackVisibility()
  const stores = await getDbStores(isCashbackEnabled)

  // 1. Gather all coupon offers from static stores data
  const staticCoupons: CouponItem[] = stores.flatMap((store) => {
    const offers = store.offers || getStoreOffers(store)
    return offers
      .filter((o) => o.type === "coupon" || Boolean(o.code))
      .map((offer) => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        merchant: store.name,
        merchantSlug: store.slug,
        code: offer.code,
        discount: offer.discount,
        type: "coupon" as const,
        affiliateUrl: offer.affiliateUrl,
        isVerified: offer.isVerified,
        category: store.category,
        countries: offer.countries || store.countries,
      }))
  })

  // 2. Fetch coupon offers from Payload CMS if active
  let dbCoupons: CouponItem[] = []
  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const couponsResult = await payload.find({
      collection: "coupon-offers",
      where: { isActive: { equals: true } },
      limit: 100,
      sort: ["-sortOrder", "-createdAt"],
    })

    dbCoupons = couponsResult.docs.map((c: any) => ({
      id: String(c.id),
      title: c.title,
      description: c.description,
      merchant: c.merchant || "Featured Store",
      merchantSlug: c.merchantSlug || (c.merchant || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
      code: c.code,
      discount: c.discount || "Verified Code",
      type: "coupon" as const,
      affiliateUrl: c.affiliateUrl || "https://google.com",
      isVerified: c.isVerified ?? true,
      category: c.category || "electronics",
      countries: Array.isArray(c.countries) && c.countries.length > 0 ? c.countries : ["IN"],
    }))
  } catch {
    // fallback
  }

  // Deduplicate: DB coupons take priority
  const seenCodes = new Set<string>()
  const allCoupons: CouponItem[] = []

  for (const c of dbCoupons) {
    const merchantKey = String(c.merchantSlug || c.merchant || "").toLowerCase()
    const codeKey = String(c.code || c.title || "").toLowerCase()
    const key = `${merchantKey}::${codeKey}`
    seenCodes.add(key)
    allCoupons.push(c)
  }

  for (const c of staticCoupons) {
    const merchantKey = String(c.merchantSlug || c.merchant || "").toLowerCase()
    const codeKey = String(c.code || c.title || "").toLowerCase()
    const key = `${merchantKey}::${codeKey}`
    if (!seenCodes.has(key)) {
      seenCodes.add(key)
      allCoupons.push(c)
    }
  }
  const couponStores = stores.filter((s) => s.hasCoupons).slice(0, 8)

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Coupons", href: "/coupons" },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <section className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 text-purple-800 px-3 py-1 text-xs font-black uppercase tracking-wider mb-3">
            <Scissors className="h-3.5 w-3.5" />
            Promo Codes &amp; Vouchers
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Verified Coupon Codes &amp; Discounts
          </h1>
          <p className="mt-2 text-[15.5px] text-slate-700 leading-relaxed">
            Tested and verified promo codes updated daily. Click &ldquo;Copy Code &amp; Shop&rdquo; to copy your discount code to your clipboard and auto-redirect to the store checkout.
          </p>
        </section>

        {/* Popular Stores for Coupons */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Top Stores with Active Codes:
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
            {couponStores.map((store) => {
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

        {/* Coupons Explorer Component */}
        <CouponsExplorer
          initialCoupons={allCoupons}
          stores={stores.map((s) => ({
            name: s.name,
            slug: s.slug,
            initial: s.initial,
            bg: s.bg,
            offersCount: s.offers ? s.offers.length : (s.couponsCount ?? 0),
            countries: s.countries,
          }))}
        />

        {/* SEO & Guide */}
        <section className="mt-16 pt-10 border-t border-slate-200">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
              How CouponKodee Codes Work
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed mb-6">
              Never pay full price again. When you find a store offer with a coupon code, clicking the button automatically copies the code to your clipboard and opens the merchant’s checkout in a new window with tracking enabled.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Scissors className="h-4 w-4 text-purple-600" />
                  <span>1-Click Copy</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your coupon code is copied instantly without needing to manually highlight text.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Hand-Tested Daily</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Broken and expired coupon codes are pruned automatically to save your time.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Zap className="h-4 w-4 text-amber-600" />
                  <span>{isCashbackEnabled ? "Stack with Cashback" : "Exclusive Discounts"}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isCashbackEnabled
                    ? "Apply your coupon for instant checkout price drop and earn extra cashback too!"
                    : "Apply your coupon for instant checkout price drop and enjoy maximum savings on every order."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
