"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useCountry } from "@/components/country-context"
import { CountryFlag } from "@/components/country-flag"
import { getAllStores } from "@/lib/stores-data"
import { isEntityInCountry } from "@/lib/countries-data"
import {
  BadgeCheck,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react"
import { HeroSlidingBanners } from "@/components/hero-sliding-banners"
import { PopularBrandsRotator } from "@/components/popular-brands-rotator"
import { useCashbackVisibility } from "@/components/cashback-context"
import { type HeroBannerItem } from "@/lib/cms-types"

interface HomeHeroProps {
  searchTerm?: string
  heroSettings?: {
    kicker?: string
    title?: string
    subtitle?: string
    badgeText?: string
    cashbackPillLabel?: string
    autoSlideInterval?: number
    showOfficialBadge?: boolean
    bannerHoverPause?: boolean
    banners?: HeroBannerItem[]
  }
}

export function HomeHero({ searchTerm = "", heroSettings }: HomeHeroProps) {
  const { country } = useCountry()
  const isCashbackEnabled = useCashbackVisibility()



  const sampleCashback = {
    IN: "₹450",
    US: "$45.00",
    UK: "£35.00",
    AE: "120 AED",
    CA: "C$50.00",
    AU: "A$55.00",
    SG: "S$60.00",
    DE: "€40.00",
    GLOBAL: "$45.00",
  }[country.code] || "$45.00"

  return (
    <section className="relative overflow-hidden pt-3 pb-6 sm:py-8 lg:py-16">
      <div className="container mx-auto px-1.5 sm:px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Main Value Prop & Search (7 Cols) - Desktop/Laptop Only */}
          <div className="hidden lg:block lg:col-span-7 space-y-6">
            
            {/* 1. Regional Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-purple-200 shadow-xs text-xs font-bold text-slate-800 backdrop-blur-sm">
              <CountryFlag code={country.code} size="sm" />
              <span>{country.name}&apos;s Smart Savings &amp; Discounts Hub</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                {country.badge}
              </span>
            </div>

            {/* 2. Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                {heroSettings?.title &&
                !heroSettings.title.toLowerCase().includes("cashback") &&
                heroSettings.title !== "Real Cashback, Instant Verified Coupons" ? (
                  heroSettings.title
                ) : (
                  <>
                    Instant Verified Coupons &amp;{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800">
                      Exclusive Deals
                    </span>
                  </>
                )}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-medium pt-1">
                {heroSettings?.subtitle &&
                !heroSettings.subtitle.toLowerCase().includes("cashback") &&
                heroSettings.subtitle !==
                  "Shop at India's top 500+ stores, automatically apply verified coupon codes, and earn direct bank-transferable cashback on every order."
                  ? heroSettings.subtitle
                  : "Discover verified coupon codes and exclusive deals from India's top 500+ stores. Find offers and save on your favourite brands."}
              </p>
            </div>

            {/* Trust Proof Pillars */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 font-bold">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-slate-900 font-extrabold">100% Tested Daily</span>
                  <small className="text-slate-500 font-medium">Zero broken codes</small>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-slate-900 font-extrabold">Instant Savings</span>
                  <small className="text-slate-500 font-medium">Verified promo codes</small>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-slate-900 font-extrabold">Updated Live</span>
                  <small className="text-slate-500 font-medium">Every 15 minutes</small>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Savings Showcase & Deals Deck (5 Cols) */}
          <div className="lg:col-span-5 relative mt-0">
            <div className="relative w-full sm:mx-auto sm:max-w-md lg:max-w-none space-y-4">
              
              {/* Top Card: Sliding Banners Showcase */}
              <HeroSlidingBanners
                customBanners={heroSettings?.banners}
                autoSlideInterval={heroSettings?.autoSlideInterval}
                showOfficialBadge={heroSettings?.showOfficialBadge}
                bannerHoverPause={heroSettings?.bannerHoverPause}
              />



            </div>
          </div>

        </div>

        {/* Full-Width Rotating Brands Ribbon */}
        <div className="mt-4 sm:mt-8 lg:mt-10 w-full">
          <PopularBrandsRotator
            stores={country.popularStores || []}
            countryName={country.name}
            countryCode={country.code}
            currencySymbol={country.currency}
          />
        </div>
      </div>
    </section>
  )
}

