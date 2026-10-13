"use client"

import { useState, useRef, useEffect } from "react"
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Zap,
} from "lucide-react"

export interface OfferData {
  id: string
  title: string
  description?: string | null
  merchant: string
  code?: string | null
  discount: string
  type?: "coupon" | "deal" | "cashback"
  affiliateUrl: string
  expiresAt?: string | null
  isVerified?: boolean | null
  countries?: string[]
}

interface StoreOfferCardProps {
  offer: OfferData
}

import { getBrandLogo } from "@/lib/brand-logos"
import { CouponModal } from "@/components/coupon-modal"
import { useCashbackVisibility } from "@/components/cashback-context"

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

export function StoreOfferCard({ offer }: StoreOfferCardProps) {
  const isCashbackEnabled = useCashbackVisibility()
  const isCashback = offer.type === "cashback" || Boolean(offer.discount && offer.discount.toLowerCase().includes("cashback"))

  if (!isCashbackEnabled && (isCashback || /cashback/i.test(offer.title) || /cashback/i.test(offer.description || ""))) {
    return null
  }

  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isCoupon = Boolean(offer.code && offer.code.trim().length > 0) || offer.type === "coupon"
  const merchantName = offer.merchant || "Featured Partner"
  const logo = getBrandLogo(merchantName)
  const discountBadge = getDiscountBadge(offer.discount, offer.title)

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current)
    }
  }, [])

  // Generate tracking redirect link
  const redirectUrl = `/out?url=${encodeURIComponent(offer.affiliateUrl || "#")}&merchant=${encodeURIComponent(
    merchantName.toLowerCase()
  )}${offer.code ? `&code=${encodeURIComponent(offer.code)}` : ""}`

  const handleAction = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (isCoupon && offer.code) {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(offer.code).catch(() => {})
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 3500)
      setIsModalOpen(true)

      // Open store in another tab / new page
      if (typeof window !== "undefined") {
        window.open(redirectUrl, "_blank", "noopener,noreferrer")
      }
      return
    }

    // Direct deal or cashback - open store in another tab / new page
    if (typeof window !== "undefined") {
      window.open(redirectUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleCardClick = () => {
    if (isModalOpen) return
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current)
    setIsModalOpen(false)
  }

  return (
    <article
      onClick={handleCardClick}
      className="group flex flex-col justify-between h-full p-3 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-2xs hover:shadow-lg hover:shadow-purple-950/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="flex-1 flex flex-col">
        {/* ==================== MOBILE LAYOUT FOR ALL OFFER CARDS (< 640px) ==================== */}
        <div className="sm:hidden flex flex-col items-center text-center">
          {/* 1. Brand Name (Centered, prominent, matching reference spacing) */}
          <div className="flex items-center justify-center w-full">
            <span className="text-[16px] font-extrabold text-slate-900 tracking-tight truncate text-center">
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
            <h3 className="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2 text-center">
              {isCoupon ? cleanOfferTitle(offer.title, offer.discount) : offer.title}
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

            <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Verified</span>
            </span>
          </div>

          {/* Desktop Offer Title */}
          <div className="mt-3.5 min-h-[2.5rem] flex items-start">
            <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug tracking-tight line-clamp-2">
              {offer.title}
            </h3>
          </div>

          {/* Desktop Description */}
          <div className="mt-1.5 flex-1 min-h-[2.25rem] flex items-start">
            <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
              {offer.description || (isCoupon ? "Apply this verified promo code at checkout to save instantly." : "Click below to activate this verified store offer and discount.")}
            </p>
          </div>
        </div>

      </div>

      {/* 4. Standardized CTA Action */}
      <div className="mt-2.5 sm:mt-4">
        <button
          type="button"
          onClick={handleAction}
          className={`w-full inline-flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl font-bold text-[12px] min-[360px]:text-[13px] sm:text-sm transition-all shadow-sm active:scale-[0.98] ${
            copied
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : isCashback
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md"
              : "bg-purple-700 hover:bg-purple-800 text-white shadow-purple-600/20 hover:shadow-md hover:shadow-purple-600/25"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-200 shrink-0" />
              <span className="whitespace-nowrap tracking-tight">Copied! Store Opened</span>
            </>
          ) : isCoupon ? (
            <>
              <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="sm:hidden whitespace-nowrap tracking-tight">View Coupon</span>
              <span className="hidden sm:inline whitespace-nowrap tracking-tight">Copy Code &amp; Visit Store</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </>
          ) : isCashback ? (
            <>
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="whitespace-nowrap tracking-tight">Activate Cashback &amp; Shop</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </>
          ) : (
            <>
              <span className="sm:hidden whitespace-nowrap tracking-tight">View Deal</span>
              <span className="hidden sm:inline whitespace-nowrap tracking-tight">Get Deal &amp; Visit Store</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>

      {/* Pop of Code / Offer Details Modal */}
      {isModalOpen && (
        <CouponModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          coupon={{
            title: offer.title,
            code: offer.code || "",
            merchant: offer.merchant,
            discount: offer.discount,
            description: offer.description,
            affiliateUrl: offer.affiliateUrl,
            isVerified: offer.isVerified ?? true,
          }}
        />
      )}
    </article>
  )
}
