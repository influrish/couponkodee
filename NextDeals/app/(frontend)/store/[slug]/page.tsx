import { redirect } from "next/navigation"
import Link from "@/components/localized-link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { DEFAULT_REGION } from "@/lib/regions"
import { getDbStores, getDbStoreBySlug, getDbSimilarStores } from "@/lib/db-stores"
import { Breadcrumb } from "@/components/breadcrumb"
import { StoreOffersView } from "@/components/store-offers-view"
import { getBrandLogo } from "@/lib/brand-logos"
import { StoreLogoImage } from "@/components/store-logo-image"
import { StoreRegionNotice } from "@/components/store-region-notice"
import { StickyStoreCta } from "@/components/sticky-store-cta"
import { getCashbackVisibility } from "@/lib/cms-settings"
import { buildStoreFaqs, currentMonthLabel, getBestPercentOff, getRegionalSiblings } from "@/lib/store-insights"
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Zap,
} from "lucide-react"
import { getOfferCount } from "@/lib/offer-count"

// ISR revalidation
export const revalidate = 60

const PRIMARY_CTA_ID = "store-primary-cta"

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

  // Concrete numbers and the current month raise click-through from search results.
  const offers = store.offers || []
  const best = getBestPercentOff(offers)
  const codes = offers.filter((o) => o.code).length
  const month = currentMonthLabel()

  return {
    title: `${store.name} Coupons & Promo Codes${best ? `: Up to ${best}% Off` : ""} (${month}) | CouponKodee`,
    description: `${offers.length} verified ${store.name} offers for ${month}${codes ? `, including ${codes} working coupon ${codes === 1 ? "code" : "codes"}` : ""}${best ? `. Save up to ${best}%` : ""}. Tested daily; copy a code and shop in one click.`,
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params
  const isCashbackEnabled = await getCashbackVisibility()
  const store = await getDbStoreBySlug(slug, isCashbackEnabled)

  if (!store) {
    // Banners and brand rotators link by display name (e.g. "best-buy"); send
    // unknown slugs to the directory filtered by that name instead of a 404.
    redirect(`/stores?q=${encodeURIComponent(slug.replace(/[-_]+/g, " ").slice(0, 100))}`)
  }

  const offers = store.offers || []
  const [similarStores, allStores] = await Promise.all([
    getDbSimilarStores(store.slug, store.category, 4, isCashbackEnabled),
    getDbStores(isCashbackEnabled),
  ])
  const siblings = getRegionalSiblings(store, allStores).map((s) => ({
    slug: s.slug,
    name: s.name,
    countries: s.countries || [],
  }))

  const codeCount = offers.filter((o) => o.code).length
  const bestPercent = getBestPercentOff(offers)
  const month = currentMonthLabel()
  const faqs = buildStoreFaqs(store, offers, isCashbackEnabled)

  const directStoreUrl = `/out?url=${encodeURIComponent(store.affiliateUrl)}&merchant=${encodeURIComponent(
    store.slug
  )}`

  // Absolute, region-specific URLs for structured data
  const region = (await headers()).get("x-region") || DEFAULT_REGION
  const siteBase = `${(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "")}/${region}`

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteBase },
        { "@type": "ListItem", position: 2, name: "Stores", item: `${siteBase}/stores` },
        { "@type": "ListItem", position: 3, name: store.name, item: `${siteBase}/store/${store.slug}` },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 sm:pb-16">
      <script
        type="application/ld+json"
        // "<" is escaped so store text can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <Breadcrumb
        variant="bar"
        items={[
          { label: "Home", href: "/" },
          { label: "Stores", href: "/stores" },
          { label: store.name, href: `/store/${store.slug}` },
        ]}
      />

      <div className="container py-5 sm:py-8">
        {/* Store hero: compact on mobile so the first offers are visible without scrolling */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:rounded-3xl sm:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
              <StoreLogoImage
                src={store.logoUrl}
                alt={store.name}
                initial={store.initial}
                bg={store.bg}
                size="lg"
                className="sm:!hidden"
              />
              <StoreLogoImage
                src={store.logoUrl}
                alt={store.name}
                initial={store.initial}
                bg={store.bg}
                size="xl"
                className="!hidden sm:!flex"
              />

              <div className="min-w-0">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {store.name} Coupons &amp; Offers
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                  {store.isVerified && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <BadgeCheck className="h-4 w-4" /> Verified
                    </span>
                  )}
                  <span>
                    {offers.length} {offers.length === 1 ? "offer" : "offers"}
                    {codeCount > 0 && ` · ${codeCount} ${codeCount === 1 ? "code" : "codes"}`}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Updated {month}</span>
                </p>
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-md">
                  {store.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <Link
                    href={`/category/${store.category}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 transition-colors hover:bg-purple-100 hover:text-purple-700"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {store.categoryName}
                  </Link>
                  {bestPercent && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 font-semibold text-purple-700">
                      <Tag className="h-3.5 w-3.5" /> Up to {bestPercent}% off
                    </span>
                  )}
                  {store.cashbackRate && isCashbackEnabled && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                      <CircleDollarSign className="h-3.5 w-3.5" /> {store.cashbackRate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-1.5 md:w-56">
              <a
                id={PRIMARY_CTA_ID}
                href={directStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 text-sm font-bold text-white shadow-sm transition-all hover:bg-purple-800 hover:shadow active:scale-[0.98]"
              >
                Shop at {store.name}
                <ExternalLink className="h-4 w-4" />
              </a>
              <span className="text-center text-xs text-slate-500">Opens the official store</span>
            </div>
          </div>
        </section>

        <StoreRegionNotice storeName={store.name} storeCountries={store.countries || []} siblings={siblings} />

        {/* Cashback highlight (when enabled) */}
        {store.cashbackRate && isCashbackEnabled && (
          <section className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white shadow-md sm:mb-8 sm:p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <CircleDollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-emerald-900/40 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-200">
                    <Zap className="h-3 w-3" /> Extra savings
                  </div>
                  <h2 className="text-lg font-extrabold sm:text-xl">
                    Earn {store.cashbackRate} on {store.name}
                  </h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-emerald-100">
                    {store.cashbackTerms ||
                      "Activate cashback, shop at the store as usual, and receive cashback in your CouponKodee wallet."}
                  </p>
                </div>
              </div>
              <a
                href={directStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-emerald-900 shadow-sm transition-all hover:bg-emerald-50"
              >
                Activate Cashback
                <ArrowRight className="h-4 w-4 text-emerald-700" />
              </a>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Offers */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">All {store.name} offers</h2>
              <p className="mt-0.5 text-sm text-slate-600">Best savings first. Codes copy automatically when you click.</p>
            </div>

            <StoreOffersView storeName={store.name} offers={offers} />

            {/* How to use */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-slate-900">
                <HelpCircle className="h-4 w-4 text-purple-600" />
                How to use {store.name} coupons
              </h2>
              <ol className="space-y-3 text-sm text-slate-700">
                {[
                  ["Pick an offer", `Choose a verified ${store.name} code or deal from the list above.`],
                  ["Show the code", `Click "Show Code". It's copied for you and ${store.name} opens in a new tab.`],
                  [
                    "Paste at checkout",
                    `Paste the code in the promo box before paying.${isCashbackEnabled ? " Cashback tracks within 24 to 72 hours." : ""}`,
                  ],
                ].map(([title, text], i) => (
                  <li key={title} className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="font-semibold text-slate-900">{title}:</strong> {text}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* FAQ (also published as FAQPage structured data) */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-2 text-base font-extrabold text-slate-900">{store.name} coupon FAQs</h2>
              <div className="divide-y divide-slate-100">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-slate-900">
                      {faq.question}
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">{store.name} at a glance</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600">Active offers</dt>
                  <dd className="font-semibold text-slate-900">{offers.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600">Coupon codes</dt>
                  <dd className="font-semibold text-purple-700">{codeCount}</dd>
                </div>
                {bestPercent && (
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Best saving</dt>
                    <dd className="font-semibold text-slate-900">Up to {bestPercent}% off</dd>
                  </div>
                )}
                {store.cashbackRate && isCashbackEnabled && (
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Cashback</dt>
                    <dd className="font-semibold text-emerald-700">{store.cashbackRate}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600">Category</dt>
                  <dd className="font-semibold text-slate-900">{store.categoryName}</dd>
                </div>
              </dl>
            </div>

            {similarStores.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
                  Similar {store.categoryName} stores
                </h3>
                <div className="space-y-1">
                  {similarStores.map((s) => {
                    const logo = s.logoUrl || getBrandLogo(s.slug) || getBrandLogo(s.name)
                    const count = getOfferCount(s)
                    return (
                      <Link
                        key={s.slug}
                        href={`/store/${s.slug}`}
                        className="group flex items-center justify-between rounded-xl p-2.5 transition-all hover:bg-purple-50/60"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <StoreLogoImage src={logo} alt={s.name} initial={s.initial} bg={s.bg} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-purple-700">{s.name}</p>
                            {s.cashbackRate && isCashbackEnabled ? (
                              <span className="block truncate text-xs font-semibold text-emerald-700">{s.cashbackRate}</span>
                            ) : (
                              <span className="text-xs text-slate-500">
                                {count} {count === 1 ? "offer" : "offers"}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-purple-600" />
                      </Link>
                    )
                  })}
                </div>
                <Link href="/stores" className="mt-4 block text-center text-sm font-semibold text-purple-700 hover:underline">
                  View all stores
                </Link>
              </div>
            )}

            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                CouponKodee promise
              </div>
              <p className="text-xs leading-relaxed">
                Offers for {store.name} are reviewed and verified daily. When you buy through our links we may earn a
                commission, at no extra cost to you.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <StickyStoreCta storeName={store.name} href={directStoreUrl} watchId={PRIMARY_CTA_ID} offerCount={offers.length} />
    </div>
  )
}
