"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "@/components/localized-link"
import { useCountry } from "@/components/country-context"
import { CountryFlag } from "@/components/country-flag"
import { getBrandLogo } from "@/lib/brand-logos"
import { type HeroBannerItem } from "@/lib/cms-types"
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useCashbackVisibility } from "@/components/cashback-context"

export interface BannerSlide {
  id: string
  storeName: string
  storeSlug: string
  storeLogo?: string | null
  bannerImage: string
  countryCode: string
  verifiedBadge: string
  cashbackTag: string
  title: string
  subtitle: string
  promoCode: string
  rating: string
  successRate: string
  gradientAccent: string
  linkUrl?: string
}

interface HeroSlidingBannersProps {
  customBanners?: HeroBannerItem[]
  autoSlideInterval?: number
  showOfficialBadge?: boolean
  bannerHoverPause?: boolean
}

const getSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

function getOfficialBannerFallback(slug: string, countryCode: string): string {
  const code = countryCode.toUpperCase()

  // Canada specific banners
  if (code === "CA") {
    if (slug.includes("amazon")) return "/banners/banner-amazon-ca.svg"
    if (slug.includes("walmart")) return "/banners/banner-walmart-ca.svg"
    if (slug.includes("best-buy") || slug.includes("bestbuy")) return "/banners/banner-bestbuy-ca.svg"
    if (slug.includes("canadian-tire") || slug.includes("canadiantire")) return "/banners/banner-canadiantire-ca.svg"
    if (slug.includes("lululemon")) return "/banners/banner-lululemon-ca.svg"
    if (slug.includes("costco")) return "/banners/banner-costco-ca.svg"
    return "/banners/banner-amazon-ca.svg"
  }

  // Australia specific banners
  if (code === "AU") {
    if (slug.includes("woolworth")) return "/banners/banner-woolworths-au.svg"
    if (slug.includes("jbhifi") || slug.includes("jb-hifi")) return "/banners/banner-jbhifi-au.svg"
    if (slug.includes("iconic")) return "/banners/banner-theiconic-au.svg"
    if (slug.includes("amazon")) return "/banners/banner-amazon-us.svg"
    return "/banners/banner-woolworths-au.svg"
  }

  // UAE specific banners
  if (code === "AE") {
    if (slug.includes("noon")) return "/banners/banner-noon-ae.svg"
    if (slug.includes("sharaf")) return "/banners/banner-sharafdg-ae.svg"
    return "/banners/banner-noon-ae.svg"
  }

  // Singapore specific banners
  if (code === "SG") {
    if (slug.includes("lazada")) return "/banners/banner-lazada-sg.svg"
    if (slug.includes("grab")) return "/banners/banner-grab-sg.svg"
    return "/banners/banner-lazada-sg.svg"
  }

  // Germany specific banners
  if (code === "DE") {
    if (slug.includes("mediamarkt")) return "/banners/banner-mediamarkt-de.svg"
    if (slug.includes("otto")) return "/banners/banner-otto-de.svg"
    return "/banners/banner-mediamarkt-de.svg"
  }

  // UK specific banners
  if (code === "UK") {
    if (slug.includes("amazon")) return "/banners/banner-amazon-uk.svg"
    if (slug.includes("asos")) return "/banners/banner-asos-uk.svg"
    if (slug.includes("currys")) return "/banners/banner-currys-uk.svg"
    if (slug.includes("boots")) return "/banners/banner-boots-uk.svg"
    if (slug.includes("argos")) return "/banners/banner-argos-uk.svg"
    return "/banners/banner-amazon-uk.svg"
  }

  // India specific banners
  if (code === "IN") {
    if (slug.includes("amazon")) return "/banners/banner-amazon-in.svg"
    if (slug.includes("flipkart")) return "/banners/banner-flipkart-in.svg"
    if (slug.includes("myntra")) return "/banners/banner-myntra-in.svg"
    if (slug.includes("swiggy")) return "/banners/banner-swiggy-in.svg"
    if (slug.includes("ajio")) return "/banners/banner-ajio-in.svg"
    return "/banners/banner-amazon-in.svg"
  }

  // US and Global default banners
  if (slug.includes("amazon")) return "/banners/banner-amazon-us.svg"
  if (slug.includes("walmart")) return "/banners/banner-walmart-us.svg"
  if (slug.includes("target")) return "/banners/banner-target-us.svg"
  if (slug.includes("best-buy") || slug.includes("bestbuy")) return "/banners/banner-bestbuy-us.svg"
  if (slug.includes("nike")) return "/banners/banner-nike-us.svg"

  return "/banners/banner-amazon-us.svg"
}

export function HeroSlidingBanners({
  customBanners,
  autoSlideInterval = 4500,
  showOfficialBadge = true,
  bannerHoverPause = true,
}: HeroSlidingBannersProps) {
  const { country } = useCountry()
  const isCashbackEnabled = useCashbackVisibility()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [failedBanners, setFailedBanners] = useState<Record<string, boolean>>({})
  const touchStartXRef = useRef<number | null>(null)

  // Generate slides for current country
  const slides: BannerSlide[] = useMemo(() => {
    // 1. If CMS custom banners exist, filter matching country or global
    if (customBanners && customBanners.length > 0) {
      const matching = customBanners.filter(
        (b) => !b.countryCode || b.countryCode === country.code || b.countryCode === "ALL"
      )
      if (matching.length > 0) {
        return matching.map((b, idx) => {
          const slug = getSlug(b.storeName)
          return {
            id: `cms-${idx}`,
            storeName: b.storeName,
            storeSlug: slug,
            storeLogo: getBrandLogo(slug) || getBrandLogo(b.storeName),
            bannerImage: b.bannerImage || getOfficialBannerFallback(slug, country.code),
            countryCode: b.countryCode || country.code,
            verifiedBadge: "Verified Today",
            cashbackTag: b.cashbackRate || "Up to 8.5% CB",
            title: b.title,
            subtitle:
              b.subtitle ||
              `Valid across popular categories in ${country.name} with verified single-click coupon code.`,
            promoCode: b.code,
            rating: b.storeRating || "4.9/5 Store Rating",
            successRate: b.successRate || "98.6% Success Rate",
            gradientAccent:
              idx % 3 === 0
                ? "from-purple-500/15"
                : idx % 3 === 1
                ? "from-indigo-500/15"
                : "from-emerald-500/15",
            linkUrl: b.linkUrl || `/stores?q=${encodeURIComponent(b.storeName)}`,
          }
        })
      }
    }

    const code = country.code

    // UK Specific Curated Slides with Official Banners
    if (code === "UK") {
      return [
        {
          id: "uk-1",
          storeName: "Amazon UK",
          storeSlug: "amazon",
          storeLogo: getBrandLogo("amazon"),
          bannerImage: "/banners/banner-amazon-uk.svg",
          countryCode: "UK",
          verifiedBadge: "Verified Today",
          cashbackTag: "Up to 8.5% CB",
          title: "Flat 25% Off + Extra £ 450 Cashback",
          subtitle: "Valid across popular categories with verified single-click coupon code.",
          promoCode: "UKSAVE25",
          rating: "4.9/5 Store Rating",
          successRate: "98.6% Success Rate",
          gradientAccent: "from-purple-500/15",
        },
        {
          id: "uk-2",
          storeName: "ASOS",
          storeSlug: "asos",
          storeLogo: getBrandLogo("asos"),
          bannerImage: "/banners/banner-asos-uk.svg",
          countryCode: "UK",
          verifiedBadge: "Trending Fashion",
          cashbackTag: "Up to 6.0% CB",
          title: "Up to 30% Off Fresh Outfits + £ 280 Cashback",
          subtitle: "Exclusive verified promo code on streetwear, dresses & footwear.",
          promoCode: "ASOSUK30",
          rating: "4.8/5 Store Rating",
          successRate: "99.1% Success Rate",
          gradientAccent: "from-pink-500/15",
        },
        {
          id: "uk-3",
          storeName: "Currys",
          storeSlug: "currys",
          storeLogo: getBrandLogo("currys") || getBrandLogo("amazon"),
          bannerImage: "/banners/banner-currys-uk.svg",
          countryCode: "UK",
          verifiedBadge: "Price Match Tech",
          cashbackTag: "Up to 5.0% CB",
          title: "Save £ 100 on Tech, Laptops & Appliances",
          subtitle: "Instant verified discount across computers, smartphones and TVs.",
          promoCode: "CURRYS100",
          rating: "4.7/5 Store Rating",
          successRate: "97.8% Success Rate",
          gradientAccent: "from-blue-500/15",
        },
        {
          id: "uk-4",
          storeName: "Boots",
          storeSlug: "boots",
          storeLogo: getBrandLogo("boots"),
          bannerImage: "/banners/banner-boots-uk.svg",
          countryCode: "UK",
          verifiedBadge: "Top Health & Beauty",
          cashbackTag: "Up to 7.5% CB",
          title: "Buy 1 Get 1 Half Price + Extra £ 180 Cashback",
          subtitle: "Premium skincare, luxury perfumes and wellness essentials.",
          promoCode: "BOOTSGLAM",
          rating: "4.9/5 Store Rating",
          successRate: "99.3% Success Rate",
          gradientAccent: "from-emerald-500/15",
        },
        {
          id: "uk-5",
          storeName: "Argos",
          storeSlug: "argos",
          storeLogo: getBrandLogo("argos"),
          bannerImage: "/banners/banner-argos-uk.svg",
          countryCode: "UK",
          verifiedBadge: "Fast Track Delivery",
          cashbackTag: "Up to 4.5% CB",
          title: "Flat 20% Off Toys, Home & Tech Deals",
          subtitle: "Save big on household appliances, furniture and garden items.",
          promoCode: "ARGOS20",
          rating: "4.8/5 Store Rating",
          successRate: "98.2% Success Rate",
          gradientAccent: "from-amber-500/15",
        },
      ]
    }

    // India Specific Curated Slides with Official Banners
    if (code === "IN") {
      return [
        {
          id: "in-1",
          storeName: "Amazon India",
          storeSlug: "amazon",
          storeLogo: getBrandLogo("amazon"),
          bannerImage: "/banners/banner-amazon-in.svg",
          countryCode: "IN",
          verifiedBadge: "Verified Today",
          cashbackTag: "Up to 8.5% CB",
          title: "Flat 25% Off + Extra ₹450 Bank Cashback",
          subtitle: "Valid across mobiles, electronics, daily pantry & fashion.",
          promoCode: "INSAVE25",
          rating: "4.9/5 Store Rating",
          successRate: "98.6% Success Rate",
          gradientAccent: "from-purple-500/15",
        },
        {
          id: "in-2",
          storeName: "Flipkart",
          storeSlug: "flipkart",
          storeLogo: getBrandLogo("flipkart"),
          bannerImage: "/banners/banner-flipkart-in.svg",
          countryCode: "IN",
          verifiedBadge: "Big Savings",
          cashbackTag: "Up to 7.0% CB",
          title: "Up to 60% Off Flash Deals + ₹300 Cashback",
          subtitle: "Exclusive verified coupon on smartphones, laptops and appliances.",
          promoCode: "FLIPKART60",
          rating: "4.8/5 Store Rating",
          successRate: "98.1% Success Rate",
          gradientAccent: "from-blue-500/15",
        },
        {
          id: "in-3",
          storeName: "Myntra",
          storeSlug: "myntra",
          storeLogo: getBrandLogo("myntra"),
          bannerImage: "/banners/banner-myntra-in.svg",
          countryCode: "IN",
          verifiedBadge: "Fashion Festival",
          cashbackTag: "Up to 6.5% CB",
          title: "Flat ₹400 Off on Orders Above ₹1,499",
          subtitle: "Save on top apparel, sneakers, watches and beauty brands.",
          promoCode: "MYNTRA400",
          rating: "4.9/5 Store Rating",
          successRate: "99.2% Success Rate",
          gradientAccent: "from-pink-500/15",
        },
        {
          id: "in-4",
          storeName: "Swiggy",
          storeSlug: "swiggy",
          storeLogo: getBrandLogo("swiggy"),
          bannerImage: "/banners/banner-swiggy-in.svg",
          countryCode: "IN",
          verifiedBadge: "Food & Instamart",
          cashbackTag: "Up to 5.0% CB",
          title: "Up to 50% Off First 3 Food Orders + Free Delivery",
          subtitle: "Delicious dining discounts and instant grocery essentials.",
          promoCode: "SWIGGY50",
          rating: "4.8/5 Store Rating",
          successRate: "98.9% Success Rate",
          gradientAccent: "from-amber-500/15",
        },
        {
          id: "in-5",
          storeName: "Ajio",
          storeSlug: "ajio",
          storeLogo: getBrandLogo("ajio"),
          bannerImage: "/banners/banner-ajio-in.svg",
          countryCode: "IN",
          verifiedBadge: "Trends Verified",
          cashbackTag: "Up to 8.0% CB",
          title: "Flat ₹500 Off on Trending Footwear & Clothes",
          subtitle: "Use verified voucher on international and indie fashion labels.",
          promoCode: "AJIO500",
          rating: "4.7/5 Store Rating",
          successRate: "97.5% Success Rate",
          gradientAccent: "from-emerald-500/15",
        },
      ]
    }

    // US Specific Curated Slides with Official Banners
    if (code === "US") {
      return [
        {
          id: "us-1",
          storeName: "Amazon US",
          storeSlug: "amazon",
          storeLogo: getBrandLogo("amazon"),
          bannerImage: "/banners/banner-amazon-us.svg",
          countryCode: "US",
          verifiedBadge: "Verified Today",
          cashbackTag: "Up to 8.5% CB",
          title: "Flat 25% Off + Extra $45.00 Cashback",
          subtitle: "Prime eligible discounts on gadgets, home, electronics and apparel.",
          promoCode: "USSAVE25",
          rating: "4.9/5 Store Rating",
          successRate: "98.6% Success Rate",
          gradientAccent: "from-purple-500/15",
        },
        {
          id: "us-2",
          storeName: "Walmart",
          storeSlug: "walmart",
          storeLogo: getBrandLogo("walmart"),
          bannerImage: "/banners/banner-walmart-us.svg",
          countryCode: "US",
          verifiedBadge: "Rollbacks Live",
          cashbackTag: "Up to 5.0% CB",
          title: "Up to 50% Off Rollbacks & Tech Deals",
          subtitle: "Extra savings on household essentials, electronics and groceries.",
          promoCode: "WALMART20",
          rating: "4.8/5 Store Rating",
          successRate: "98.2% Success Rate",
          gradientAccent: "from-blue-500/15",
        },
        {
          id: "us-3",
          storeName: "Target",
          storeSlug: "target",
          storeLogo: getBrandLogo("target"),
          bannerImage: "/banners/banner-target-us.svg",
          countryCode: "US",
          verifiedBadge: "Target Circle",
          cashbackTag: "Up to 4.5% CB",
          title: "Extra 20% Off Home, Kitchen & Apparel",
          subtitle: "Apply exclusive digital promo code at online checkout.",
          promoCode: "TARGET20",
          rating: "4.8/5 Store Rating",
          successRate: "98.4% Success Rate",
          gradientAccent: "from-red-500/15",
        },
        {
          id: "us-4",
          storeName: "Best Buy",
          storeSlug: "best-buy",
          storeLogo: getBrandLogo("best-buy"),
          bannerImage: "/banners/banner-bestbuy-us.svg",
          countryCode: "US",
          verifiedBadge: "Top Electronics",
          cashbackTag: "Up to 4.0% CB",
          title: "Save Up to $150 on Laptops, 4K TVs & Audio",
          subtitle: "Verified discount with manufacturer warranty and free store pickup.",
          promoCode: "BBTECH15",
          rating: "4.7/5 Store Rating",
          successRate: "97.9% Success Rate",
          gradientAccent: "from-amber-500/15",
        },
        {
          id: "us-5",
          storeName: "Nike",
          storeSlug: "nike",
          storeLogo: getBrandLogo("nike"),
          bannerImage: "/banners/banner-nike-us.svg",
          countryCode: "US",
          verifiedBadge: "Member Exclusive",
          cashbackTag: "Up to 7.0% CB",
          title: "Flat 20% Off Running Shoes & Sportswear",
          subtitle: "Score verified promo code on Jordan, Air Max and training gear.",
          promoCode: "NIKEPRO20",
          rating: "4.9/5 Store Rating",
          successRate: "99.4% Success Rate",
          gradientAccent: "from-slate-500/15",
        },
      ]
    }

    // Dynamic fallback for any other country (AE, CA, AU, SG, DE, GLOBAL)
    const storesList = country.popularStores && country.popularStores.length > 0
      ? country.popularStores
      : ["Amazon", "Walmart", "Nike", "Target", "ASOS"]

    const sampleSavings = {
      AE: { curr: "AED", val: "120 AED", saveVal: "250 AED" },
      CA: { curr: "C$", val: "C$50.00", saveVal: "C$100" },
      AU: { curr: "A$", val: "A$55.00", saveVal: "A$120" },
      SG: { curr: "S$", val: "S$60.00", saveVal: "S$150" },
      DE: { curr: "€", val: "€40.00", saveVal: "€100" },
      GLOBAL: { curr: "$", val: "$45.00", saveVal: "$100" },
    }[code] || { curr: country.currency, val: `${country.currency} 45`, saveVal: `${country.currency} 100` }

    const badges = ["Verified Today", "Trending Now", "Flash Sale", "Exclusive Deal", "Top Rated"]
    const discountHeadlines = [
      `Flat 25% Off + Extra ${sampleSavings.val} Cashback`,
      `Up to 40% Off Seasonal Deals + Verified Voucher`,
      `Save ${sampleSavings.saveVal} on Top Electronics & Home`,
      `Buy 1 Get 1 Half Price + Highest Cashback Guarantee`,
      `Flat 20% Off Everything with Single-Click Code`,
    ]

    return storesList.slice(0, 5).map((storeName, i) => {
      const slug = getSlug(storeName)
      const cleanSlug = slug.replace(/[^a-z0-9]/g, "").slice(0, 5).toUpperCase()
      return {
        id: `${code.toLowerCase()}-${i}`,
        storeName,
        storeSlug: slug,
        storeLogo: getBrandLogo(slug) || getBrandLogo(storeName),
        bannerImage: getOfficialBannerFallback(slug, code),
        countryCode: code,
        verifiedBadge: badges[i % badges.length],
        cashbackTag: `Up to ${7.5 + (i % 3) * 0.5}% CB`,
        title: discountHeadlines[i % discountHeadlines.length],
        subtitle: `Valid across popular categories in ${country.name} with verified single-click coupon code.`,
        promoCode: `${code}${cleanSlug || "SAVE"}25`,
        rating: "4.9/5 Store Rating",
        successRate: "98.6% Success Rate",
        gradientAccent:
          i % 3 === 0
            ? "from-purple-500/15"
            : i % 3 === 1
            ? "from-indigo-500/15"
            : "from-emerald-500/15",
      }
    })
  }, [country, customBanners])

  // Reset slide index and image-error state when country changes:
  // slide ids are index-based, so old failures would hide the new country's banners
  useEffect(() => {
    setCurrentSlide(0)
    setFailedBanners({})
  }, [country.code])

  // Auto-slide effect (configurable from admin, default 4500ms)
  useEffect(() => {
    const rawInterval = autoSlideInterval ?? 4500
    const intervalMs = rawInterval <= 60 ? rawInterval * 1000 : rawInterval

    if ((bannerHoverPause && isHovered) || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, intervalMs)

    return () => clearInterval(interval)
  }, [isHovered, slides.length, autoSlideInterval, bannerHoverPause])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX

    if (diff > 40) {
      nextSlide()
    } else if (diff < -40) {
      prevSlide()
    }
    touchStartXRef.current = null
  }

  return (
    <div
      className="relative select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide track: artwork is 2.4:1, matching the track, so it fills edge to edge */}
      <div className="overflow-hidden relative w-full hero-banner-track rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-shadow">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const destinationUrl = slide.linkUrl || `/store/${slide.storeSlug}`

            return (
              <Link
                key={slide.id}
                href={destinationUrl}
                className="w-full h-full shrink-0 relative flex items-center justify-center overflow-hidden group/slide cursor-pointer bg-slate-900"
                title={`${slide.storeName} - Visit Store`}
              >
                {failedBanners[slide.id] ? (
                  <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {slide.storeLogo && (
                          <span className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={slide.storeLogo} alt={slide.storeName} className="h-full w-full object-contain" />
                          </span>
                        )}
                        <div>
                          <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest block">OFFICIAL PARTNER</span>
                          <h3 className="text-base sm:text-xl font-extrabold">{slide.storeName}</h3>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                        {slide.verifiedBadge}
                      </span>
                    </div>
                    <div className="my-2">
                      <h2 className="text-2xl font-extrabold text-white">
                        {!isCashbackEnabled
                          ? slide.title
                              .replace(/\s*\+\s*Extra\s*[^+]*(?:Bank\s*)?Cashback/gi, " + Verified Savings")
                              .replace(/Highest Cashback Guarantee/gi, "Best Discount Guarantee")
                              .replace(/Cashback/gi, "Discount")
                          : slide.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl line-clamp-2">
                        {!isCashbackEnabled
                          ? slide.subtitle.replace(/cashback/gi, "discount")
                          : slide.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/20 font-mono text-xs sm:text-sm font-bold text-cyan-400">
                        {slide.promoCode}
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-purple-700 text-white font-bold text-xs sm:text-sm">
                        Shop Now ↗
                      </span>
                    </div>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.bannerImage}
                    alt={`${slide.storeName} Official Offer Banner`}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/slide:scale-[1.02]"
                    loading={index === 0 ? "eager" : "lazy"}
                    onError={() => setFailedBanners((prev) => ({ ...prev, [slide.id]: true }))}
                  />
                )}

                {/* Official Offer Pill Tag */}
                {showOfficialBadge && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-2xs sm:text-xs font-bold text-white border border-white/20 shadow-md pointer-events-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Official Ongoing Offer</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Floating Prev Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            prevSlide()
          }}
          className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md hover:scale-105 active:scale-95 cursor-pointer z-20 border border-white/20"
          aria-label="Previous banner"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Floating Next Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            nextSlide()
          }}
          className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md hover:scale-105 active:scale-95 cursor-pointer z-20 border border-white/20"
          aria-label="Next banner"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Slide indicators sit below the card, on the page background, so they never cover banner text */}
      <div className="mt-2 flex items-center justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setCurrentSlide(idx)
            }}
            className="group/dot inline-flex items-center justify-center p-1.5"
            aria-label={`Go to banner slide ${idx + 1}`}
            aria-current={currentSlide === idx ? "true" : undefined}
          >
            <span
              className={`block h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "w-5 sm:w-6 bg-purple-600" : "w-1.5 sm:w-2 bg-slate-300 group-hover/dot:bg-slate-400"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

