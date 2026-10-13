"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useCountry } from "@/components/country-context"
import { CountryFlag } from "@/components/country-flag"
import { isEntityInCountry } from "@/lib/countries-data"
import { StoreItem, getStoreOffers } from "@/lib/stores-data"
import { getBrandLogo } from "@/lib/brand-logos"
import { CouponCard } from "@/components/coupon-card"
import { CashbackCard } from "@/components/cashback-card"
import { DealCard } from "@/components/deal-card"
import { StoreOfferCard } from "@/components/store-offer-card"
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Globe,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react"
import { useCashbackVisibility } from "@/components/cashback-context"

interface HomeDynamicContentProps {
  allStores: StoreItem[]
  initialCoupons: any[]
  initialCashbacks: any[]
  initialDeals: any[]
  searchTerm?: string
}

export function HomeDynamicContent({
  allStores,
  initialCoupons,
  initialCashbacks,
  initialDeals,
  searchTerm = "",
}: HomeDynamicContentProps) {
  const { country } = useCountry()
  const isCashbackEnabled = useCashbackVisibility()
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({})

  // 1. Stores operating in active region
  const regionalStores = useMemo(() => {
    return allStores.filter((store) =>
      isEntityInCountry(store.countries, store.slug, country.code)
    )
  }, [allStores, country.code])

  // 2. Coupons valid in active region
  const regionalCoupons = useMemo(() => {
    const directMatches = initialCoupons.filter((c) =>
      isEntityInCountry(c.countries, c.merchantSlug || c.merchant?.toLowerCase(), country.code)
    )

    const list = [...directMatches]
    const seenCodes = new Set(list.map((c) => `${c.merchant?.toLowerCase()}::${c.code || c.title}`))

    for (const store of regionalStores) {
      if (list.length >= 8) break
      const offers = getStoreOffers(store)
      for (const o of offers) {
        if (list.length >= 8) break
        const key = `${store.name.toLowerCase()}::${o.code || o.title}`
        if ((o.type === "coupon" || o.code) && !seenCodes.has(key)) {
          seenCodes.add(key)
          list.push({
            id: o.id,
            title: o.title,
            description: o.description,
            merchant: store.name,
            code: o.code,
            discount: o.discount,
            affiliateUrl: o.affiliateUrl,
            isVerified: o.isVerified,
            countries: o.countries,
          })
        }
      }
    }

    return list.slice(0, 8)
  }, [initialCoupons, regionalStores, country.code])

  // 3. Cashback Offers valid in active region
  const regionalCashbacks = useMemo(() => {
    const directMatches = initialCashbacks.filter((cb) =>
      isEntityInCountry(cb.countries, cb.merchantSlug || cb.merchant?.toLowerCase(), country.code)
    )

    const list = [...directMatches]
    const seenMerchants = new Set(list.map((cb) => (cb.merchant || "").toLowerCase()))

    // Prioritize high-demand popular cashback stores (Zepto, Swiggy, Myntra, Amazon, Flipkart)
    const prioritySlugs = ["zepto", "swiggy", "myntra", "amazon", "flipkart", "zomato"]
    const sortedStores = [...regionalStores].sort((a, b) => {
      const idxA = prioritySlugs.indexOf(a.slug)
      const idxB = prioritySlugs.indexOf(b.slug)
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
    })

    for (const s of sortedStores) {
      if (list.length >= 6) break
      if (s.hasCashback && s.cashbackRate && !seenMerchants.has(s.name.toLowerCase())) {
        seenMerchants.add(s.name.toLowerCase())
        list.push({
          id: `cb-${s.id}`,
          title: `Earn ${s.cashbackRate} on All Valid Orders`,
          description: s.cashbackTerms || `Activate cashback before shopping at ${s.name} to receive rewards.`,
          merchant: s.name,
          cashbackRate: s.cashbackRate || "Earn Cashback",
          affiliateUrl: s.affiliateUrl,
          isVerified: true,
          countries: s.countries,
        })
      }
    }

    list.sort((a, b) => {
      const slugA = (a.merchantSlug || a.merchant || "").toLowerCase()
      const slugB = (b.merchantSlug || b.merchant || "").toLowerCase()
      const idxA = prioritySlugs.indexOf(slugA)
      const idxB = prioritySlugs.indexOf(slugB)
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1
      return 0
    })

    return list.slice(0, 6)
  }, [initialCashbacks, regionalStores, country.code])

  // 4. Deals valid in active region
  const regionalDeals = useMemo(() => {
    const directMatches = initialDeals.filter((d) =>
      isEntityInCountry(d.countries, d.merchantSlug || d.merchant?.toLowerCase(), country.code)
    )

    const list = [...directMatches]
    const seenTitles = new Set(list.map((d) => `${(d.merchant || "").toLowerCase()}::${d.title?.toLowerCase()}`))

    for (const store of regionalStores) {
      if (list.length >= 8) break
      const offers = getStoreOffers(store)
      const topDeal = offers.find((o) => o.type === "deal") || offers[0]
      if (topDeal) {
        const key = `${store.name.toLowerCase()}::${topDeal.title.toLowerCase()}`
        if (!seenTitles.has(key)) {
          seenTitles.add(key)
          list.push({
            id: topDeal.id,
            title: topDeal.title,
            description: topDeal.description,
            merchant: store.name,
            code: topDeal.code,
            discount: topDeal.discount,
            type: topDeal.type || "deal",
            affiliateUrl: topDeal.affiliateUrl,
            isVerified: topDeal.isVerified,
            countries: topDeal.countries,
          })
        }
      }
    }

    return list.slice(0, 8)
  }, [initialDeals, regionalStores, country.code])

  return (
    <div>
      <div className="container mx-auto px-4">
        {/* 1. POPULAR REGIONAL STORES */}
        <section id="stores" className="section-block pt-0">
          <div className="section-heading">
            <div>
              <h2 className="mt-0">Popular Stores &amp; {isCashbackEnabled ? "Cashback" : "Offers"}</h2>
            </div>
            <Link href="/stores" className="section-link hidden sm:inline-flex">
              View all {regionalStores.length} stores <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {regionalStores.slice(0, 8).map((store) => {
              const isFailed = failedLogos[store.slug]
              const logo = !isFailed ? (store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name)) : null
              return (
                <Link
                  key={store.slug}
                  href={`/store/${store.slug}`}
                  className="group relative rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition-all p-3 sm:store-card"
                >
                  {/* MOBILE VIEW (< 640px) */}
                  <div className="sm:hidden flex flex-col items-center justify-between text-center w-full gap-2 py-1">
                    {/* Top: Full brand name with verified badge */}
                    <div className="flex items-center justify-center gap-1.5 w-full">
                      <span className="font-extrabold text-[15px] text-slate-900 group-hover:text-purple-700 transition-colors text-center leading-snug break-words">
                        {store.name}
                      </span>
                      <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    </div>

                    {/* Below: Brand logo */}
                    <div
                      className={`h-[52px] w-[52px] rounded-xl overflow-hidden shadow-2xs flex items-center justify-center my-0.5 ${
                        logo ? "bg-white border border-slate-200/80 p-1" : store.bg
                      }`}
                    >
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logo}
                          alt={store.name}
                          className="h-full w-full object-contain"
                          onError={() => setFailedLogos((prev) => ({ ...prev, [store.slug]: true }))}
                        />
                      ) : (
                        <span className="font-black text-white text-base">{store.initial}</span>
                      )}
                    </div>

                    {/* Below the logo: Offers count, such as "2 Offers" */}
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                      2 Offers
                    </span>
                  </div>

                  {/* DESKTOP / TABLET VIEW (>= 640px) UNCHANGED */}
                  <div className="hidden sm:flex items-center gap-[0.85rem] w-full">
                    <span
                      className={`store-card__logo overflow-hidden ${
                        logo ? "bg-white border border-slate-200 p-1" : store.bg
                      }`}
                    >
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logo}
                          alt={store.name}
                          className="h-full w-full object-contain"
                          onError={() => setFailedLogos((prev) => ({ ...prev, [store.slug]: true }))}
                        />
                      ) : (
                        store.initial
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="truncate group-hover:text-purple-700 transition-colors">
                        {store.name}
                      </strong>
                      <span className="text-xs font-extrabold text-emerald-600 truncate mt-0.5 block">
                        {isCashbackEnabled ? (store.cashbackRate || "Verified Coupons") : "Verified Coupons"}
                      </span>
                      {(() => {
                        const count = store.offers ? store.offers.length : (store.couponsCount ?? 0)
                        return (
                          <small className="text-slate-500 font-semibold whitespace-nowrap block mt-0.5">
                            {count} {count === 1 ? "live offer" : "live offers"}
                          </small>
                        )
                      })()}
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Mobile-only "View all stores →" Button (Beneath Store Cards) */}
          <div className="mt-3.5 sm:hidden flex justify-center">
            <Link
              href="/stores"
              className="section-link w-full justify-center py-2.5"
            >
              View all {regionalStores.length} stores <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* 2. BEST VERIFIED COUPONS FOR THIS REGION */}
        <section id="coupons" className="section-block">
          <div className="section-heading">
            <div>
              <p className="section-kicker">HANDPICKED FOR {country.name.toUpperCase()}</p>
              <h2>{searchTerm ? `Coupons for “${searchTerm}”` : `Best Verified Coupons & Promo Codes (${country.code})`}</h2>
            </div>
            <Link href="/coupons" className="section-link hidden sm:inline-flex">
              View all coupons <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {regionalCoupons.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {regionalCoupons.map((coupon: any) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          ) : (
            <div className="empty-deals">
              No coupons found for {country.name}. Try browsing our global stores or search another keyword.
            </div>
          )}

          {/* Mobile-only "View all coupons →" Button (Beneath Coupon Cards) */}
          <div className="mt-3.5 sm:hidden flex justify-center">
            <Link
              href="/coupons"
              className="section-link w-full justify-center py-2.5"
            >
              View All Coupons <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* 3. CASHBACK SECTION FOR THIS REGION */}
        {isCashbackEnabled && (
          <section id="cashback" className="section-block">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-800 via-indigo-800 to-slate-900 p-6 sm:p-8 md:p-10 text-white shadow-xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
              {/* Ambient decorative lighting */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-purple-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 shadow-inner">
                  <CircleDollarSign className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-300" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-emerald-200 text-xs font-black uppercase tracking-wider mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                    Maximize Your Savings in {country.currency} {country.currencyCode}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                    Earn Extra Cashback on Top of Store Discounts!
                  </h2>
                  <p className="mt-2 text-purple-100 text-sm sm:text-[15px] max-w-2xl leading-relaxed">
                    Shop at top {country.name} stores through CouponKodee and earn real money back directly into your account in {country.currency} {country.currencyCode}.
                  </p>
                </div>
              </div>

              <div className="relative z-10 shrink-0 w-full sm:w-auto">
                <Link
                  href="/cashback"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-slate-900 hover:text-emerald-950 font-black text-sm sm:text-base shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap group border border-white/80"
                >
                  <span>Explore Cashback Offers</span>
                  <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">SHOP, EARN &amp; WITHDRAW</p>
                  <h2>Top Cashback Offers Today ({country.name})</h2>
                </div>
                <Link href="/cashback" className="section-link hidden sm:inline-flex">
                  View all cashback stores <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {regionalCashbacks.map((offer: any) => (
                  <CashbackCard key={offer.id} offer={offer} />
                ))}
              </div>

              {/* Mobile-only "View all cashback offers →" Button (Beneath Cashback Cards) */}
              <div className="mt-3.5 sm:hidden flex justify-center">
                <Link
                  href="/cashback"
                  className="section-link w-full justify-center py-2.5"
                >
                  View All Cashback Offers <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 4. TRENDING DEALS OF THE DAY FOR THIS REGION */}
        <section id="deals" className="section-block">
          <div className="section-heading">
            <div>
              <p className="section-kicker">DON&apos;T MISS OUT IN {country.code}</p>
              <h2>{searchTerm ? `Deals for “${searchTerm}”` : `Trending Deals of the Day (${country.name})`}</h2>
            </div>
            <Link href="/deals" className="section-link hidden sm:inline-flex">
              See all deals <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {regionalDeals.map((deal: any) => {
              if (deal.price !== undefined && deal.slug) {
                return <DealCard key={deal.id} product={deal} />
              }
              return (
                <StoreOfferCard
                  key={`home-deal-${deal.id}`}
                  offer={{
                    id: deal.id,
                    title: deal.title,
                    description: deal.description,
                    merchant: deal.merchant,
                    code: deal.code,
                    discount: deal.discount,
                    type: deal.type || "deal",
                    affiliateUrl: deal.affiliateUrl,
                    isVerified: deal.isVerified,
                    countries: deal.countries,
                  }}
                />
              )
            })}
          </div>

          {/* Mobile-only "View all deals →" Button (Beneath Deal Cards) */}
          <div className="mt-3.5 sm:hidden flex justify-center">
            <Link
              href="/deals"
              className="section-link w-full justify-center py-2.5"
            >
              View All Deals <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
