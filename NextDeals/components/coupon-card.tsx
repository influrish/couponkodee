"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowRight, BadgeCheck, Check, CheckCircle2, Copy, ShieldCheck } from "lucide-react"
import { getBrandLogo } from "@/lib/brand-logos"
import { CouponModal } from "@/components/coupon-modal"

export interface CouponCardProps {
  coupon: {
    id: string
    title: string
    description?: string | null
    merchant: string
    code: string
    discount?: string | null
    affiliateUrl: string
    isVerified?: boolean | null
    expiresAt?: string | null
    countries?: string[]
  }
}

function cleanOfferTitle(title: string, discount?: string | null): string {
  if (!title) return discount ? `${discount} Off` : "Special Discount Offer"
  return title
    .replace(/^(exclusive offer|limited time offer|coupon code|verified coupon|promo code|special offer)\s*[:\-–]\s*/i, "")
    .replace(/\s*\((?:terms and conditions apply|t&c apply|limited period)\)/i, "")
    .trim()
}

function getDiscountBadge(discount?: string | null, title?: string): string {
  if (discount && discount.trim()) {
    const d = discount.trim()
    return /off|save|cashback|bogo/i.test(d) ? d : `${d} OFF`
  }
  if (title) {
    const match = title.match(/(?:flat|extra|up to)?\s*[₹$€£]\s*[\d,]+(?:\s*off)?|(?:flat|extra|up to)?\s*\d+%\s*off|bogo\s*free/i)
    if (match) return match[0].trim()
  }
  return "Verified Offer"
}

// Cashback offers are rendered by CashbackCard, never as coupons.
export function CouponCard({ coupon }: CouponCardProps) {
  if (
    /cashback/i.test(coupon.title) ||
    /cashback/i.test(coupon.description || "") ||
    /cashback/i.test(coupon.discount || "")
  ) {
    return null
  }
  return <CouponCardContent coupon={coupon} />
}

function CouponCardContent({ coupon }: CouponCardProps) {
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const copyResetTimerRef = useRef<NodeJS.Timeout | null>(null)
  const logo = getBrandLogo(coupon.merchant)
  const discountBadge = getDiscountBadge(coupon.discount, coupon.title)

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current)
    }
  }, [])

  const redirectUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl || "https://google.com")}&merchant=${encodeURIComponent(
    coupon.merchant || "store"
  )}&code=${encodeURIComponent(coupon.code)}`

  const handleCopyAndShop = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (coupon.code && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(coupon.code).catch(() => {})
    }
    setCopied(true)
    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current)
    copyResetTimerRef.current = setTimeout(() => setCopied(false), 3500)
    setIsModalOpen(true)

    // Open store in another tab / new page
    if (typeof window !== "undefined") {
      window.open(redirectUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleCardClick = () => {
    if (isModalOpen) return
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
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
              {coupon.merchant}
            </span>
          </div>

          {/* 2. Brand Logo (Height 1.5 cm = ~57px, original aspect ratio, centered) */}
          <div className="flex items-center justify-center my-2 min-h-[57px] h-[57px] w-full">
            {logo && !logoError ? (
              <span className="h-[57px] max-h-[57px] w-auto max-w-[130px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={coupon.merchant}
                  className="h-[57px] w-auto max-w-[130px] object-contain select-none"
                  onError={() => setLogoError(true)}
                />
              </span>
            ) : (
              <span className="h-[57px] w-[57px] rounded-xl bg-purple-100 text-purple-700 font-bold text-xl flex items-center justify-center shadow-2xs">
                {coupon.merchant.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* 3. Offer Details / Title (Centered, 2-line consistent height) */}
          <div className="flex items-center justify-center w-full min-h-[2.4rem]">
            <h3 className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2 text-center">
              {cleanOfferTitle(coupon.title, coupon.discount)}
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
                    alt={coupon.merchant}
                    className="h-full w-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                </span>
              ) : (
                <span className="h-11 w-11 rounded-xl bg-purple-100 text-purple-700 font-bold text-base flex items-center justify-center shadow-2xs shrink-0">
                  {coupon.merchant.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="text-base font-bold text-slate-900 truncate tracking-tight">
                {coupon.merchant}
              </span>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1 text-2xs font-semibold text-emerald-600">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Verified</span>
            </span>
          </div>

          {/* Desktop Offer Title */}
          <div className="mt-3.5 min-h-[2.5rem] flex items-start">
            <h3 className="text-md font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug tracking-tight line-clamp-2">
              {coupon.title}
            </h3>
          </div>

          {/* Desktop Description */}
          <div className="mt-1.5 flex-1 min-h-[2.25rem] flex items-start">
            <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
              {coupon.description || "Apply this coupon code at checkout to unlock savings on your order."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. CTA Action (Both Mobile & Desktop) */}
      <div className="mt-2.5 sm:mt-4">
        <button
          type="button"
          onClick={handleCopyAndShop}
          className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl font-bold text-xs min-[360px]:text-xs sm:text-sm transition-all shadow-sm active:scale-[0.98] ${
            copied
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-purple-700 hover:bg-purple-800 text-white shadow-purple-600/20 hover:shadow-md hover:shadow-purple-600/25"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-200 shrink-0" />
              <span className="whitespace-nowrap tracking-tight">Copied! Store Opened</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="sm:hidden whitespace-nowrap tracking-tight">View Coupon</span>
              <span className="hidden sm:inline whitespace-nowrap tracking-tight">Copy Code &amp; Visit Store</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        coupon={{
          title: coupon.title,
          code: coupon.code,
          merchant: coupon.merchant,
          discount: coupon.discount,
          description: coupon.description,
          affiliateUrl: coupon.affiliateUrl,
          isVerified: coupon.isVerified ?? true,
        }}
      />
    </article>
  )
}
