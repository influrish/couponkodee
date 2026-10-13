import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { StoreOfferCard } from "@/components/store-offer-card"
import { getBrandLogo } from "@/lib/brand-logos"
import { StoreLogoImage } from "@/components/store-logo-image"
import {
  getStoresByCategory,
  getAllStores,
  getStoreOffers,
  StoreItem,
} from "@/lib/stores-data"
import { getDbStores } from "@/lib/db-stores"
import { getPayloadClient } from "@/src/lib/payload"
import { getCashbackVisibility } from "@/lib/cms-settings"
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Layers,
  Percent,
  ShoppingBag,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react"

// ISR: Revalidate every 60 seconds
export const revalidate = 60

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

const CATEGORY_META: Record<
  string,
  { name: string; description: string; normalizedSlug: string }
> = {
  fashion: {
    name: "Fashion & Clothing",
    description:
      "Save big on men's & women's apparel, footwear, accessories, and designer wear from top stores like Myntra, Ajio, and Tata Cliq.",
    normalizedSlug: "fashion",
  },
  electronics: {
    name: "Electronics & Gadgets",
    description:
      "Verified coupon codes and exclusive deals on smartphones, laptops, audio gear, and appliances from Amazon, Flipkart, Samsung, and boAt.",
    normalizedSlug: "electronics",
  },
  food: {
    name: "Food & Dining",
    description:
      "Exclusive promo codes and discounts on online food delivery, restaurants, and cloud kitchens from Swiggy, Zomato, and Domino's.",
    normalizedSlug: "food",
  },
  travel: {
    name: "Travel & Flights",
    description:
      "Best deals on domestic & international flights, hotel bookings, holiday packages, and bus tickets from MakeMyTrip and Cleartrip.",
    normalizedSlug: "travel",
  },
  beauty: {
    name: "Beauty & Wellness",
    description:
      "Discounts and exclusive offers on premium skincare, makeup, haircare, and personal health products from Nykaa, Tata 1mg, and Purplle.",
    normalizedSlug: "beauty",
  },
  "health-beauty": {
    name: "Beauty & Wellness",
    description:
      "Discounts and exclusive offers on premium skincare, makeup, haircare, and personal health products from Nykaa, Tata 1mg, and Purplle.",
    normalizedSlug: "beauty",
  },
  home: {
    name: "Home & Living",
    description:
      "Savings on home decor, furniture, kitchen appliances, and daily home improvement essentials from Pepperfry, Amazon, and IKEA.",
    normalizedSlug: "home",
  },
  "home-garden": {
    name: "Home & Living",
    description:
      "Savings on home decor, furniture, kitchen appliances, and daily home improvement essentials from Pepperfry, Amazon, and IKEA.",
    normalizedSlug: "home",
  },
  grocery: {
    name: "Grocery & Essentials",
    description:
      "Instant coupons and discounts for instant grocery deliveries, daily staples, and organic foods from Zepto, Swiggy Instamart, and Blinkit.",
    normalizedSlug: "grocery",
  },
}

export async function generateStaticParams() {
  const staticSlugs = Object.keys(CATEGORY_META)

  try {
    const payload = await getPayloadClient()
    const categories = await payload.find({
      collection: "categories",
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: 100,
    })

    const payloadSlugs = categories.docs.map((category) => category.slug)
    const combined = Array.from(new Set([...staticSlugs, ...payloadSlugs]))
    return combined.map((slug) => ({ slug }))
  } catch {
    return staticSlugs.map((slug) => ({ slug }))
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const isCashbackEnabled = await getCashbackVisibility()
  const meta = CATEGORY_META[slug]

  if (meta) {
    return {
      title: isCashbackEnabled
        ? `${meta.name} Coupons, Promo Codes & Cashback Deals | CouponKodee`
        : `${meta.name} Coupons & Promo Deals | CouponKodee`,
      description: isCashbackEnabled
        ? meta.description
        : meta.description.replace(/and cashback\s*/gi, "").replace(/,\s*promo codes and cashback/gi, " and promo codes"),
    }
  }

  try {
    const payload = await getPayloadClient()
    const categoryResult = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (categoryResult.docs.length > 0) {
      const cat = categoryResult.docs[0]
      return {
        title: `${cat.name} Coupons & Deals | CouponKodee`,
        description: cat.description || `Browse the best coupons and discounts in ${cat.name}.`,
      }
    }
  } catch {
    // fallback
  }

  return {
    title: "Category Deals | CouponKodee",
    description: isCashbackEnabled
      ? "Browse verified coupons, promo codes, and cashback offers."
      : "Browse verified coupons, promo codes, and special offers.",
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const isCashbackEnabled = await getCashbackVisibility()

  if (!isCashbackEnabled && slug === "cashback") {
    notFound()
  }

  const normalizedKey = slug.toLowerCase()

  // 1. Resolve Category Details
  let categoryName = CATEGORY_META[normalizedKey]?.name
  let categoryDescription = CATEGORY_META[normalizedKey]?.description
  const categoryStoreLookupKey = CATEGORY_META[normalizedKey]?.normalizedSlug || normalizedKey

  if (!categoryName) {
    try {
      const payload = await getPayloadClient()
      const categoryResult = await payload.find({
        collection: "categories",
        where: { slug: { equals: slug } },
        limit: 1,
      })

      if (categoryResult.docs.length > 0) {
        const cat = categoryResult.docs[0]
        categoryName = cat.name
        categoryDescription = cat.description || `Find top deals and verified coupons in ${cat.name}`
      }
    } catch {
      // ignore
    }
  }

  if (!categoryName) {
    notFound()
  }

  if (!isCashbackEnabled && categoryDescription) {
    categoryDescription = categoryDescription
      .replace(/and cashback\s*/gi, "")
      .replace(/,\s*promo codes and cashback/gi, " and promo codes")
  }

  // 2. Fetch Relevant Stores for this category
  const allStores = await getDbStores(isCashbackEnabled)
  const relevantStores = allStores.filter(
    (s) => s.category === categoryStoreLookupKey || s.category === slug
  )

  // 3. Collect Verified Offers from these stores
  const allCategoryOffers = relevantStores.flatMap((store) => {
    const storeOffers = store.offers || getStoreOffers(store)
    return storeOffers.map((offer) => ({
      ...offer,
      merchant: store.name,
    }))
  })

  // Separate coupons, deals, and cashback
  const visibleCategoryOffers = isCashbackEnabled
    ? allCategoryOffers
    : allCategoryOffers.filter((o) => o.type !== "cashback")
  const categoryCoupons = visibleCategoryOffers.filter((o) => o.type === "coupon")
  const categoryCashbackStores = isCashbackEnabled
    ? relevantStores.filter((s) => s.hasCashback && s.cashbackRate)
    : []

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/#categories" },
              { label: categoryName, href: `/category/${slug}` },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Header Banner */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 text-purple-800 px-3 py-1 text-xs font-black uppercase tracking-wider mb-3">
              <ShoppingBag className="h-3.5 w-3.5" />
              Category Hub
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {categoryName} Coupons &amp; {isCashbackEnabled ? "Cashback" : "Deals"}
            </h1>
            <p className="mt-2 text-[15.5px] text-slate-700 leading-relaxed">
              {categoryDescription}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1 text-purple-700">
                <Tag className="h-4 w-4" />
                {relevantStores.length} Popular Stores
              </span>
              {isCashbackEnabled && categoryCashbackStores.length > 0 && (
                <span className="flex items-center gap-1 text-emerald-700">
                  <CircleDollarSign className="h-4 w-4" />
                  {categoryCashbackStores.length} Cashback Stores
                </span>
              )}
              <span className="flex items-center gap-1 text-slate-600">
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                {visibleCategoryOffers.length} Verified Offers
              </span>
            </div>
          </div>
        </section>

        {/* 1. RELEVANT STORES GRID */}
        {relevantStores.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-purple-700">
                  TOP BRANDS
                </p>
                <h2 className="text-xl font-black text-slate-900">
                  Popular {categoryName} Stores
                </h2>
              </div>
              <Link
                href="/stores"
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-800"
              >
                <span>All Stores</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {relevantStores.map((store) => {
                const logo = store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name)
                return (
                  <Link
                    key={store.slug}
                    href={`/store/${store.slug}`}
                    className="group flex flex-col justify-between p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all"
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
                    <div className="hidden sm:flex flex-col justify-between h-full">
                      <div className="flex items-start gap-3">
                        <StoreLogoImage
                          src={logo}
                          alt={store.name}
                          initial={store.initial}
                          bg={store.bg}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <strong className="block text-sm font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                            {store.name}
                          </strong>
                          <span className="text-xs font-semibold text-slate-500 block">
                            {(() => {
                              const count = store.offers ? store.offers.length : (store.couponsCount ?? 0)
                              return `${count} ${count === 1 ? "offer" : "offers"}`
                            })()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        {isCashbackEnabled && store.cashbackRate ? (
                          <span className="text-xs font-black text-emerald-700 truncate">
                            {store.cashbackRate}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500">
                            Special Discounts
                          </span>
                        )}
                        <span className="text-xs font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform flex items-center">
                          View &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                )
            })}
            </div>
          </section>
        )}

        {/* 2. TOP CASHBACK OFFERS IN THIS CATEGORY */}
        {categoryCashbackStores.length > 0 && (
          <section className="mb-12">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
                MAXIMIZE REWARDS
              </p>
              <h2 className="text-xl font-black text-slate-900">
                Top Cashback Rates in {categoryName}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {categoryCashbackStores.map((store) => {
                const redirectUrl = `/out?url=${encodeURIComponent(
                  store.affiliateUrl
                )}&merchant=${encodeURIComponent(store.slug)}`

                return (
                  <article
                    key={`cashback-${store.slug}`}
                    className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <StoreLogoImage
                            src={store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name)}
                            alt={store.name}
                            initial={store.initial}
                            bg={store.bg}
                            size="sm"
                          />
                          <span className="text-sm font-black text-slate-900">
                            {store.name}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                          <Zap className="h-3 w-3 text-emerald-600" /> Active
                        </span>
                      </div>

                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <CircleDollarSign className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-black text-emerald-900">
                            {store.cashbackRate}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {store.cashbackTerms ||
                          `Shop at ${store.name} through CouponKodee to earn instant bank-transferable cashback.`}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/store/${store.slug}`}
                        className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                      >
                        All Offers
                      </Link>
                      <a
                        href={redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm transition-all"
                      >
                        <span>Activate</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* 3. COUPONS & DEALS IN THIS CATEGORY */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-wider text-purple-700">
              HANDPICKED &amp; VERIFIED
            </p>
            <h2 className="text-xl font-black text-slate-900">
              Best Coupons &amp; Deals for {categoryName}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Click &ldquo;Copy Code &amp; Shop&rdquo; or &ldquo;Get Deal&rdquo; to auto-redirect and save.
            </p>
          </div>

          {visibleCategoryOffers.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {visibleCategoryOffers.slice(0, 16).map((offer) => (
                <StoreOfferCard
                  key={offer.id}
                  offer={{
                    id: offer.id,
                    title: offer.title,
                    description: offer.description,
                    merchant: offer.merchant,
                    code: offer.code,
                    discount: offer.discount,
                    type: offer.type,
                    affiliateUrl: offer.affiliateUrl,
                    isVerified: offer.isVerified,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-white">
              <p className="text-sm font-bold text-slate-700">No active offers found right now.</p>
              <p className="text-xs text-slate-500 mt-1">Please explore our other popular categories or stores.</p>
              <Link
                href="/stores"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline"
              >
                <span>Browse All Stores</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
