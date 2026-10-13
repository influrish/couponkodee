"use client"

import React, { useRef, useMemo } from "react"
import Link from "next/link"
import { getBrandLogo } from "@/lib/brand-logos"

interface PopularBrandsRotatorProps {
  stores?: string[]
  countryName?: string
  countryCode?: string
  currencySymbol?: string
}

interface BrandProfile {
  slug: string
  tagline: string
  iconBg?: string
}

const BRAND_PROFILES: Record<string, BrandProfile> = {
  makemytrip: {
    slug: "makemytrip",
    tagline: "Flights & Hotels",
    iconBg: "bg-red-600",
  },
  "make-my-trip": {
    slug: "makemytrip",
    tagline: "Flights & Hotels",
    iconBg: "bg-red-600",
  },
  jiomart: {
    slug: "jiomart",
    tagline: "Verified Deals",
    iconBg: "bg-[#0F3E99]",
  },
  "jio mart": {
    slug: "jiomart",
    tagline: "Verified Deals",
    iconBg: "bg-[#0F3E99]",
  },
  "tata cliq": {
    slug: "tata-cliq",
    tagline: "Verified Deals",
    iconBg: "bg-black",
  },
  tatacliq: {
    slug: "tata-cliq",
    tagline: "Verified Deals",
    iconBg: "bg-black",
  },
  netmeds: {
    slug: "netmeds",
    tagline: "Online Pharmacy",
    iconBg: "bg-white border border-slate-100",
  },
  "urban company": {
    slug: "urban-company",
    tagline: "Home Services",
    iconBg: "bg-black",
  },
  urbancompany: {
    slug: "urban-company",
    tagline: "Home Services",
    iconBg: "bg-black",
  },
  "h&m": {
    slug: "hm",
    tagline: "Trendy Fashion",
    iconBg: "bg-white border border-slate-100",
  },
  hm: {
    slug: "hm",
    tagline: "Trendy Fashion",
    iconBg: "bg-white border border-slate-100",
  },
  "amazon india": {
    slug: "amazon",
    tagline: "Mega Marketplace",
    iconBg: "bg-white border border-slate-100",
  },
  amazon: {
    slug: "amazon",
    tagline: "Mega Marketplace",
    iconBg: "bg-white border border-slate-100",
  },
  flipkart: {
    slug: "flipkart",
    tagline: "Big Saving Days",
    iconBg: "bg-[#2874F0]",
  },
  myntra: {
    slug: "myntra",
    tagline: "Fashion & Lifestyle",
    iconBg: "bg-white border border-slate-100",
  },
  swiggy: {
    slug: "swiggy",
    tagline: "Food & Instamart",
    iconBg: "bg-[#FC8019]",
  },
  zomato: {
    slug: "zomato",
    tagline: "Food Delivery",
    iconBg: "bg-[#E23744]",
  },
  "tata 1mg": {
    slug: "tata-1mg",
    tagline: "Health & Medicines",
    iconBg: "bg-white border border-slate-100",
  },
  nykaa: {
    slug: "nykaa",
    tagline: "Beauty & Wellness",
    iconBg: "bg-pink-600",
  },
  boat: {
    slug: "boat",
    tagline: "Audio & Wearables",
    iconBg: "bg-black",
  },
  blinkit: {
    slug: "blinkit",
    tagline: "10-Min Delivery",
    iconBg: "bg-[#F8CB46]",
  },
  zepto: {
    slug: "zepto",
    tagline: "Quick Grocery",
    iconBg: "bg-[#4B0082]",
  },
  ajio: {
    slug: "ajio",
    tagline: "Trends & Brands",
    iconBg: "bg-[#2C4152]",
  },
  croma: {
    slug: "croma",
    tagline: "Electronics Hub",
    iconBg: "bg-[#00E5D2]",
  },
  samsung: {
    slug: "samsung",
    tagline: "Smart Devices",
    iconBg: "bg-[#1428A0]",
  },
  puma: {
    slug: "puma",
    tagline: "Sportswear & Shoes",
    iconBg: "bg-black",
  },
  lenskart: {
    slug: "lenskart",
    tagline: "Eyewear & Glasses",
    iconBg: "bg-white border border-slate-100",
  },
  "domino's": {
    slug: "dominos",
    tagline: "Pizza Deals",
    iconBg: "bg-[#006491]",
  },
}

function getBrandProfile(name: string): BrandProfile {
  const key = name.toLowerCase().trim()
  if (BRAND_PROFILES[key]) return BRAND_PROFILES[key]

  const slug = key.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  return {
    slug,
    tagline: "Verified Deals",
    iconBg: "bg-white border border-slate-100",
  }
}

export function PopularBrandsRotator({
  stores = [],
}: PopularBrandsRotatorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Default brand order matching user's exact uploaded image
  const defaultStores = useMemo(() => [
    "MakeMyTrip",
    "JioMart",
    "Tata CLiQ",
    "Netmeds",
    "Urban Company",
    "H&M",
    "Amazon India",
    "Flipkart",
    "Myntra",
    "Swiggy",
    "Zomato",
    "Tata 1mg",
    "Nykaa",
    "boAt",
    "Blinkit",
    "Zepto",
    "Ajio",
    "Croma",
    "Samsung",
    "Puma",
    "Lenskart",
    "Domino's",
  ], [])

  const storeList = useMemo(() => {
    if (stores && stores.length > 0) return stores
    return defaultStores
  }, [stores, defaultStores])

  // Duplicate list once (2x) for a seamless 50% loop
  const displayStores = useMemo(() => {
    return [...storeList, ...storeList]
  }, [storeList])

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Continuous Auto-Rotating Marquee Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes brandTickerLoop {
              0% {
                transform: translate3d(0, 0, 0);
              }
              100% {
                transform: translate3d(-50%, 0, 0);
              }
            }
            .brand-ticker-track {
              display: flex !important;
              width: max-content !important;
              animation: brandTickerLoop 40s linear infinite !important;
              will-change: transform;
            }
            .brand-ticker-track:hover {
              animation-play-state: paused !important;
            }
          `,
        }}
      />

      {/* Marquee Track without outer card container - visually merges with page background */}
      <div className="relative w-full overflow-hidden transition-all">
        {/* Continuous Auto-Rotating Marquee Track */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto no-scrollbar py-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="brand-ticker-track flex items-center px-1 sm:px-2">
            {displayStores.map((storeName, idx) => {
              const profile = getBrandProfile(storeName)
              const logo = getBrandLogo(storeName)

              return (
                <div key={`${storeName}-${idx}`} className="flex items-center shrink-0">
                  <Link
                    href={`/store/${profile.slug}`}
                    className="group flex items-center gap-2.5 sm:gap-3.5 px-3 py-1.5 sm:py-2 rounded-2xl hover:bg-white/90 transition-all select-none cursor-pointer"
                  >
                    {/* App Icon Squircle */}
                    <div className="h-[47px] w-[47px] sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-xs border border-slate-200/60 bg-white p-0.5 flex items-center justify-center transition-transform group-hover:scale-105">
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logo}
                          alt={storeName}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      ) : (
                        <span className="font-black text-sm text-purple-700">
                          {storeName.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Brand Name & Tagline */}
                    <div className="min-w-0 pr-1 text-left">
                      <span className="block font-black text-[15px] sm:text-[14px] text-slate-900 group-hover:text-purple-700 tracking-tight transition-colors whitespace-nowrap leading-tight">
                        {storeName}
                      </span>
                      <span className="block text-[13px] sm:text-xs font-semibold text-slate-500 group-hover:text-purple-600 whitespace-nowrap mt-0.5 transition-colors">
                        {profile.tagline}
                      </span>
                    </div>
                  </Link>

                  {/* Subtle Vertical Divider Line */}
                  <div className="h-7 w-px bg-slate-300/40 shrink-0 mx-1.5 sm:mx-2" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
