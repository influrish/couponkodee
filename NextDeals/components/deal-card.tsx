"use client"

import { useState } from "react"
import { ArrowRight, BadgeCheck } from "lucide-react"
import { getBrandLogo } from "@/lib/brand-logos"
import { CouponModal } from "@/components/coupon-modal"

interface DealCardProps {
  product: {
    id: string
    title: string
    shortDescription?: string | null
    brand?: string | null
    pricing?: {
      originalPrice?: number | null
      currentPrice?: number | null
      discountPercentage?: number | null
    } | null
    affiliateUrl: string
    merchant: string
    images?: Array<{
      image?: any
      alt?: string | null
    }> | null
  }
}

const merchantPills: Record<string, string> = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  myntra: "Myntra",
  ajio: "Ajio",
  nykaa: "Nykaa",
  swiggy: "Swiggy",
  makemytrip: "MakeMyTrip",
  samsung: "Samsung",
  boat: "boAt Lifestyle",
  dominos: "Domino's Pizza",
  other: "Featured Store",
}

export function DealCard({ product }: DealCardProps) {
  if (
    /cashback/i.test(product.title) ||
    /cashback/i.test(product.shortDescription || "")
  ) {
    return null
  }
  return <DealCardContent product={product} />
}

function DealCardContent({ product }: DealCardProps) {
  const merchantKey = product.merchant?.toLowerCase() || "other"
  const merchantName = merchantPills[merchantKey] || product.merchant || "Featured Partner"
  const logo = getBrandLogo(product.merchant || merchantKey)
  const [logoError, setLogoError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dealUrl = `/out?url=${encodeURIComponent(product.affiliateUrl)}&merchant=${encodeURIComponent(merchantKey)}`

  const handleCardClick = () => {
    if (isModalOpen) return
    setIsModalOpen(true)
  }

  return (
    <article
      onClick={handleCardClick}
      className="group flex flex-col justify-between h-full p-3 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-2xs hover:shadow-lg hover:shadow-purple-950/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="flex-1 flex flex-col">
        {/* ==================== MOBILE LAYOUT (< 640px) ==================== */}
        <div className="sm:hidden flex flex-col items-center text-center">
          {/* 1. Brand Name (Centered, prominent, matching reference spacing) */}
          <div className="flex items-center justify-center w-full">
            <span className="text-base font-extrabold text-slate-900 tracking-tight truncate text-center">
              {merchantName}
            </span>
          </div>

          {/* 2. Brand Logo (Height 1.5 cm = ~57px, original aspect ratio, centered) */}
          <div className="flex items-center justify-center my-2 min-h-[57px] h-[57px] w-full">
            {logo && !logoError ? (
              <span className="h-[57px] max-h-[57px] w-auto max-w-[130px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={merchantName}
                  className="h-[57px] w-auto max-w-[130px] object-contain select-none"
                  onError={() => setLogoError(true)}
                />
              </span>
            ) : (
              <span className="h-[57px] w-[57px] rounded-xl bg-purple-100 text-purple-700 font-bold text-xl flex items-center justify-center shadow-2xs">
                {merchantName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* 3. Offer Details / Title (Centered, 2-line consistent height) */}
          <div className="flex items-center justify-center w-full min-h-[2.4rem]">
            <h3 className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2 text-center">
              {product.title}
            </h3>
          </div>
        </div>

        {/* ==================== DESKTOP LAYOUT (>= 640px) UNTOUCHED ==================== */}
        <div className="hidden sm:flex sm:flex-col sm:flex-1">
          {/* Desktop Brand Header */}
          <div className="flex items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {logo && !logoError ? (
                <span className="h-11 w-11 rounded-xl bg-white border border-slate-200/90 overflow-hidden flex items-center justify-center p-1.5 shadow-2xs shrink-0 group-hover:border-purple-200 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt={merchantName}
                    className="h-full w-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                </span>
              ) : (
                <span className="h-11 w-11 rounded-xl bg-purple-100 text-purple-700 font-bold text-base flex items-center justify-center shadow-2xs shrink-0">
                  {merchantName.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="text-base font-bold text-slate-900 truncate tracking-tight">
                {merchantName}
              </span>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1 text-2xs font-semibold text-emerald-600">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Verified</span>
            </span>
          </div>

          {/* Desktop Offer Title */}
          <div className="mt-3.5 min-h-[2.75rem] flex items-start">
            <h3 className="text-md font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug tracking-tight line-clamp-2">
              {product.title}
            </h3>
          </div>

          {/* Desktop Description */}
          <div className="mt-1.5 flex-1 min-h-[2.25rem] flex items-start">
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {product.shortDescription || "Special limited-time verified discount on top products from this store."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Standardized CTA Action */}
      <div className="mt-2.5 sm:mt-4">
        <a
          href={dealUrl}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl font-bold text-xs min-[360px]:text-xs sm:text-sm bg-purple-700 hover:bg-purple-800 text-white shadow-sm hover:shadow-md hover:shadow-purple-600/25 transition-all active:scale-[0.98]"
        >
          <span className="sm:hidden whitespace-nowrap tracking-tight">View Deal</span>
          <span className="hidden sm:inline whitespace-nowrap tracking-tight">Grab Deal &amp; Visit Store</span>
          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 ml-0.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* Deal Details Modal */}
      {isModalOpen && (
        <CouponModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          coupon={{
            title: product.title,
            code: "",
            merchant: merchantName,
            discount: product.pricing?.discountPercentage ? `${product.pricing.discountPercentage}% OFF` : null,
            description: product.shortDescription,
            affiliateUrl: product.affiliateUrl,
            isVerified: true,
          }}
        />
      )}
    </article>
  )
}
