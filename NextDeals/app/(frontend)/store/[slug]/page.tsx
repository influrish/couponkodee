import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getDbStores, getDbStoreBySlug, getDbSimilarStores } from "@/lib/db-stores"
import { Breadcrumb } from "@/components/breadcrumb"
import { StoreOffersView } from "@/components/store-offers-view"
import { getBrandLogo } from "@/lib/brand-logos"
import { StoreLogoImage } from "@/components/store-logo-image"
import { getCashbackVisibility } from "@/lib/cms-settings"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  HelpCircle,
  Percent,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react"

// ISR revalidation
export const revalidate = 60

interface StorePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const stores = await getDbStores()
  return stores.map((store) => ({
    slug: store.slug,
  }))
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params
  const store = await getDbStoreBySlug(slug)

  if (!store) {
    return {
      title: "Store Not Found | CouponKodee",
      description: "The requested store could not be found.",
    }
  }

  return {
    title: `${store.name} Coupons, Promo Codes & Discounts | CouponKodee`,
    description: `Discover verified ${store.name} coupon codes, exclusive discount vouchers, and daily savings. Save money on every purchase.`,
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params
  const isCashbackEnabled = await getCashbackVisibility()
  const store = await getDbStoreBySlug(slug, isCashbackEnabled)

  if (!store) {
    notFound()
  }

  const offers = store.offers || []
  const similarStores = await getDbSimilarStores(store.slug, store.category, 4, isCashbackEnabled)

  const directStoreUrl = `/out?url=${encodeURIComponent(store.affiliateUrl)}&merchant=${encodeURIComponent(
    store.slug
  )}`

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Stores", href: "/stores" },
              { label: store.name, href: `/store/${store.slug}` },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Store Profile Card Header */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              {/* Logo / Badge */}
              <StoreLogoImage
                src={store.logoUrl}
                alt={store.name}
                initial={store.initial}
                bg={store.bg}
                size="xl"
              />

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {store.name}
                  </h1>
                  {store.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      <BadgeCheck className="h-4 w-4 text-emerald-600" />
                      Verified Merchant
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-[15px] text-slate-700 max-w-2xl leading-relaxed">
                  {store.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <Link
                    href={`/category/${store.category}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 px-2.5 py-1 font-semibold transition-colors"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>{store.categoryName}</span>
                  </Link>

                  <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                    <Tag className="h-3.5 w-3.5 text-purple-600" />
                    <span>{offers.length} {offers.length === 1 ? "Live Offer" : "Live Offers"}</span>
                  </span>

                  {store.cashbackRate && isCashbackEnabled && (
                    <span className="inline-flex items-center gap-1 font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <CircleDollarSign className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{store.cashbackRate}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Shop CTA */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <a
                href={directStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 hover:bg-purple-800 px-6 py-3 text-xs font-bold text-white shadow-sm hover:shadow transition-all"
              >
                <span>Shop at {store.name}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <span className="text-xs text-center text-slate-400">
                Official store link with tracking
              </span>
            </div>
          </div>
        </section>

        {/* Cashback Highlight Banner (if available and enabled) */}
        {store.cashbackRate && isCashbackEnabled && (
          <section className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm shrink-0">
                  <CircleDollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-900/40 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-emerald-200 mb-1">
                    <Zap className="h-3 w-3" /> Extra Savings Alert
                  </div>
                  <h2 className="text-lg sm:text-xl font-black">
                    Earn {store.cashbackRate} on {store.name}!
                  </h2>
                  <p className="text-xs text-emerald-100 max-w-xl mt-1 leading-relaxed">
                    {store.cashbackTerms ||
                      "Click the activate button below, make your purchase at the store, and receive automatic cashback in your CouponKodee wallet."}
                  </p>
                </div>
              </div>

              <a
                href={directStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-emerald-50 px-6 py-3 text-xs font-black text-emerald-900 shadow-sm transition-all shrink-0"
              >
                <span>Activate Cashback</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-700" />
              </a>
            </div>
          </section>
        )}

        {/* Two-Column Grid: Left Offers (70%) + Right Sidebar (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Offers Stream */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {store.name} Coupons &amp; Deals
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Click any coupon to copy code and auto-redirect to the merchant.
                </p>
              </div>
            </div>

            {/* Interactive Offers View with tabs */}
            <StoreOffersView storeName={store.name} offers={offers} />

            {/* How to Use Coupons Guide */}
            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-purple-600" />
                How to use {store.name} coupons {isCashbackEnabled ? "& earn cashback" : "& save money"}
              </h3>

              <ol className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-black text-purple-700">
                    1
                  </span>
                  <span>
                    <strong>Pick an offer:</strong> Browse verified {store.name} coupon codes or deals from the list above.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-black text-purple-700">
                    2
                  </span>
                  <span>
                    <strong>Copy &amp; Shop:</strong> Click <em>&ldquo;Copy Code &amp; Shop&rdquo;</em>. Your promo code will be copied to your clipboard and the official {store.name} store will open automatically.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-black text-purple-700">
                    3
                  </span>
                  <span>
                    <strong>Paste &amp; Save:</strong> Paste the coupon code in the promo box at checkout to receive instant discounts.{isCashbackEnabled ? " Your additional cashback will track within 24–72 hours!" : ""}
                  </span>
                </li>
              </ol>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Store Quick Info Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 mb-4">
                {store.name} Summary
              </h3>

              <dl className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600 font-semibold">Total Active Offers</dt>
                  <dd className="font-black text-slate-900">{offers.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600 font-semibold">Verified Coupons</dt>
                  <dd className="font-black text-purple-700">
                    {offers.filter((o) => o.type === "coupon").length}
                  </dd>
                </div>
                {store.cashbackRate && isCashbackEnabled && (
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600 font-semibold">Max Cashback Rate</dt>
                    <dd className="font-black text-emerald-700">{store.cashbackRate}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600 font-semibold">Category</dt>
                  <dd className="font-bold text-slate-800">{store.categoryName}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600 font-semibold">Status</dt>
                  <dd className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                    100% Tested
                  </dd>
                </div>
              </dl>
            </div>

            {/* Similar Stores in this category */}
            {similarStores.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 mb-3">
                  Similar {store.categoryName} Stores
                </h3>

                <div className="space-y-2.5">
                  {similarStores.map((s) => {
                    const logo = s.logoUrl || getBrandLogo(s.slug) || getBrandLogo(s.name)
                    return (
                      <Link
                        key={s.slug}
                        href={`/store/${s.slug}`}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 border border-transparent hover:border-purple-100 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <StoreLogoImage
                            src={logo}
                            alt={s.name}
                            initial={s.initial}
                            bg={s.bg}
                            size="sm"
                          />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 min-w-0">
                            <p className="text-[15px] sm:text-xs font-bold text-slate-900 group-hover:text-purple-700 truncate">
                              {s.name}
                            </p>
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0 sm:hidden" />
                          </div>
                          {s.cashbackRate && isCashbackEnabled ? (
                            <span className="text-xs font-bold text-emerald-700 truncate block">
                              {s.cashbackRate}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                              {(() => {
                                const count = s.offers ? s.offers.length : (s.couponsCount ?? 0)
                                return (
                                  <>
                                    <span className="sm:hidden whitespace-nowrap">2 Offers</span>
                                    <span className="hidden sm:inline">{count} {count === 1 ? "offer" : "offers"}</span>
                                  </>
                                )
                              })()}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  )
                })}
                </div>

                <Link
                  href="/stores"
                  className="mt-4 block text-center text-xs font-bold text-purple-700 hover:underline"
                >
                  View All Stores &rarr;
                </Link>
              </div>
            )}

            {/* Trust Assurance Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                CouponKodee Promise
              </div>
              <p className="text-xs leading-relaxed">
                All coupon codes, deals, and {isCashbackEnabled ? "cashback" : "discount"} links for {store.name} are reviewed and verified daily. When you make a purchase through our affiliate links, we may earn a commission at no extra cost to you.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
