"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Copy,
  ExternalLink,
  Scissors,
  Sparkles,
  Tag,
  X,
  Zap,
} from "lucide-react"
import { getBrandLogo } from "@/lib/brand-logos"

export interface CouponModalData {
  title: string
  code?: string | null
  merchant: string
  discount?: string | null
  description?: string | null
  affiliateUrl: string
  isVerified?: boolean
  terms?: string | null
}

interface CouponModalProps {
  isOpen: boolean
  onClose: () => void
  coupon: CouponModalData | null
}

export function CouponModal({ isOpen, onClose, coupon }: CouponModalProps) {
  const [copied, setCopied] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent scrolling without layout shift when modal is open and handle Esc key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const originalPaddingRight = document.body.style.paddingRight
    const originalOverflow = document.body.style.overflow

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [isOpen, onClose])

  if (!isOpen || !coupon || !mounted) return null

  const hasCode = Boolean(coupon.code && coupon.code.trim().length > 0)
  const logo = getBrandLogo(coupon.merchant)
  const redirectUrl = `/out?url=${encodeURIComponent(
    coupon.affiliateUrl || "https://google.com"
  )}&merchant=${encodeURIComponent(coupon.merchant || "store")}${
    hasCode ? `&code=${encodeURIComponent(coupon.code!)}` : ""
  }`

  const handleCopy = () => {
    if (coupon.code && navigator.clipboard) {
      navigator.clipboard.writeText(coupon.code).catch(() => {})
    }
    setCopied(true)
    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current)
    copyResetTimerRef.current = setTimeout(() => setCopied(false), 4000)
  }

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-800 text-white p-6 sm:p-7">
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close modal"
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            {logo && !logoError ? (
              <span className="h-12 w-12 rounded-2xl bg-white border border-white/20 shadow-md flex items-center justify-center p-1.5 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={coupon.merchant}
                  className="h-full w-full object-contain"
                  onError={() => setLogoError(true)}
                />
              </span>
            ) : (
              <span className="h-12 w-12 rounded-2xl bg-white text-purple-800 font-extrabold text-lg flex items-center justify-center shadow-md shrink-0">
                {coupon.merchant.charAt(0).toUpperCase()}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                  {coupon.merchant}
                </span>
                {coupon.isVerified !== false && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
                    {hasCode ? "Verified Code" : "Verified Deal"}
                  </span>
                )}
                {coupon.discount && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
                    <Tag className="h-3.5 w-3.5" />
                    {coupon.discount}
                  </span>
                )}
              </div>

              <h2
                id="coupon-modal-title"
                className="text-lg sm:text-xl font-extrabold text-white leading-snug"
              >
                {coupon.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-7 space-y-6">
          {hasCode ? (
            /* Highlighted Coupon Box */
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/90 to-indigo-50/60 p-4 sm:p-5 relative overflow-hidden text-center shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">
                <Scissors className="h-3.5 w-3.5 rotate-[-45deg]" />
                <span>Copy and paste this code at checkout</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-purple-200 rounded-xl p-2.5 sm:pl-5 shadow-xs">
                <span className="font-mono text-2xl font-extrabold text-purple-950 tracking-widest select-all">
                  {coupon.code}
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-purple-700 hover:bg-purple-800 text-white hover:shadow-md"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Visual copied feedback banner */}
              {copied && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-lg px-3 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Code copied to clipboard! Paste it during checkout.</span>
                </div>
              )}
            </div>
          ) : (
            /* Direct Deal Box */
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 to-teal-50/60 p-4 sm:p-5 relative overflow-hidden text-center shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                <Zap className="h-3.5 w-3.5" />
                <span>Direct Deal • No Promo Code Needed</span>
              </div>
              <p className="text-sm font-bold text-slate-800 mt-1">
                Discount is applied automatically when you shop at {coupon.merchant}.
              </p>
            </div>
          )}

          {/* Quick Steps */}
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p>
                {hasCode ? (
                  <>
                    Click <strong>Copy Code</strong> above to copy{" "}
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-purple-900">
                      {coupon.code}
                    </code>
                  </>
                ) : (
                  <>
                    Click <strong>Continue to {coupon.merchant}</strong> below to open the official store.
                  </>
                )}
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p>
                Go to <strong>{coupon.merchant}</strong> and add qualifying items to your shopping cart.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <p>
                {hasCode
                  ? "Paste the coupon code in the promo / voucher box at checkout to apply your discount!"
                  : "Enjoy the verified deal savings automatically applied to your order at checkout!"}
              </p>
            </div>
          </div>

          {coupon.description && (
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Offer Details: </span>
              {coupon.description}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Continue to {coupon.merchant}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center py-3.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
