"use client"

import { useState } from "react"
import { ArrowRight, ShoppingBag, ShieldCheck, Wallet, Zap } from "lucide-react"
import { getBrandLogo } from "@/lib/brand-logos"
import { useCashbackVisibility } from "@/components/cashback-context"

interface CashbackCardProps {
  offer: {
    id: string
    title: string
    description?: string | null
    merchant: string
    cashbackRate: string
    affiliateUrl: string
    isVerified?: boolean | null
    terms?: string | null
  }
}

const brandThemes: Record<string, { gradient: string; text: string; bg: string }> = {
  zepto: { gradient: "from-[#370075] via-[#4a0099] to-[#6200c7]", text: "text-purple-700", bg: "bg-purple-900" },
  myntra: { gradient: "from-[#be123c] via-[#e11d48] to-[#fb7185]", text: "text-rose-600", bg: "bg-rose-600" },
  amazon: { gradient: "from-[#0f172a] via-[#1e293b] to-[#334155]", text: "text-amber-600", bg: "bg-slate-900" },
  ajio: { gradient: "from-[#09090b] via-[#18181b] to-[#27272a]", text: "text-slate-900", bg: "bg-black" },
  swiggy: { gradient: "from-[#c2410c] via-[#ea580c] to-[#f97316]", text: "text-orange-600", bg: "bg-orange-600" },
  zomato: { gradient: "from-[#991b1b] via-[#dc2626] to-[#ef4444]", text: "text-red-600", bg: "bg-red-600" },
  flipkart: { gradient: "from-[#1e40af] via-[#2563eb] to-[#3b82f6]", text: "text-blue-600", bg: "bg-blue-600" },
  nykaa: { gradient: "from-[#9d174d] via-[#db2777] to-[#f472b6]", text: "text-pink-600", bg: "bg-pink-600" },
  blinkit: { gradient: "from-[#854d0e] via-[#ca8a04] to-[#eab308]", text: "text-amber-700", bg: "bg-yellow-500" },
  makemytrip: { gradient: "from-[#991b1b] via-[#b91c1c] to-[#dc2626]", text: "text-red-600", bg: "bg-red-600" },
  samsung: { gradient: "from-[#1e1b4b] via-[#312e81] to-[#4338ca]", text: "text-indigo-600", bg: "bg-indigo-900" },
  "tata-1mg": { gradient: "from-[#0f766e] via-[#0d9488] to-[#14b8a6]", text: "text-teal-600", bg: "bg-teal-700" },
  netmeds: { gradient: "from-[#047857] via-[#059669] to-[#10b981]", text: "text-emerald-700", bg: "bg-emerald-700" },
  lenskart: { gradient: "from-[#312e81] via-[#3730a3] to-[#4f46e5]", text: "text-indigo-600", bg: "bg-indigo-700" },
  kfc: { gradient: "from-[#7f1d1d] via-[#991b1b] to-[#dc2626]", text: "text-red-700", bg: "bg-red-800" },
  pepperfry: { gradient: "from-[#c2410c] via-[#ea580c] to-[#f97316]", text: "text-orange-600", bg: "bg-orange-600" },
  dominos: { gradient: "from-[#0c4a6e] via-[#0284c7] to-[#0369a1]", text: "text-blue-600", bg: "bg-blue-800" },
}

function parseCashbackRate(rawRate?: string) {
  if (!rawRate) return { prefix: "Flat", amount: "₹50", suffix: "Cashback" }

  // Sanitize encoding artifacts like ? or  to ₹
  const cleaned = rawRate.replace(/[?]/g, "₹").trim()

  const match = cleaned.match(/^(flat|up to|earn|max)?\s*([₹$€£]?\s*\d+(?:\.\d+)?%?)\s*(cashback|rewards|off)?/i)
  if (match) {
    const prefix = match[1] ? match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase() : "Flat"
    const amount = match[2].trim()
    const suffix = "Cashback"
    return { prefix, amount, suffix }
  }

  return { prefix: "Flat", amount: cleaned, suffix: "Cashback" }
}

/**
 * 3D Isometric Green Ticket Voucher Graphic with Shiny Gold Rupee Coins
 * Dynamically displays the offer's exact cashback rate.
 */
function CashbackVoucherGraphic({ amount }: { amount: string }) {
  // Ensure font size scales gracefully if rate text is longer (e.g. "Up to 15%")
  const fontSize = amount.length > 5 ? (amount.length > 8 ? 32 : 38) : 46

  return (
    <div className="relative w-full max-w-[240px] aspect-[340/230] select-none pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 340 230"
        className="w-full h-full drop-shadow-md"
        fill="none"
      >
        <defs>
          <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="35%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <filter id="ticketShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="3" dy="10" stdDeviation="8" floodColor="#064e3b" floodOpacity="0.32" />
          </filter>
          <linearGradient id="gold1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="goldDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <filter id="coinShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Confetti Elements */}
        <polygon points="35,40 40,52 46,44 41,32" fill="#f59e0b" opacity="0.85" transform="rotate(18 40 42)" />
        <polygon points="305,45 310,58 317,52 312,38" fill="#f59e0b" opacity="0.8" transform="rotate(-22 311 48)" />
        <circle cx="55" cy="22" r="2.5" fill="#10b981" opacity="0.75" />
        <circle cx="295" cy="28" r="3" fill="#10b981" opacity="0.7" />
        <polygon points="22,125 26,136 31,130 27,118" fill="#fbbf24" opacity="0.75" />
        <circle cx="320" cy="115" r="2.5" fill="#f59e0b" opacity="0.75" />

        {/* Tilted Ticket Group */}
        <g transform="rotate(-8 160 105)" filter="url(#ticketShadow)">
          {/* Ticket Body with Semi-Circle Cutouts */}
          <path
            d="M 38 22 H 262 A 18 18 0 0 1 280 40 V 78 A 20 20 0 0 0 280 118 V 156 A 18 18 0 0 1 262 174 H 38 A 18 18 0 0 1 20 156 V 118 A 20 20 0 0 0 20 78 V 40 A 18 18 0 0 1 38 22 Z"
            fill="url(#ticketGrad)"
          />

          {/* Inner Dashed Stitching Border */}
          <path
            d="M 42 28 H 258 A 12 12 0 0 1 270 40 V 72 A 25 25 0 0 0 270 124 V 156 A 12 12 0 0 1 258 168 H 42 A 12 12 0 0 1 30 156 V 124 A 25 25 0 0 0 30 72 V 40 A 12 12 0 0 1 42 28 Z"
            fill="none"
            stroke="#6ee7b7"
            strokeWidth="1.6"
            strokeDasharray="4.5,4"
            opacity="0.65"
          />

          {/* REAL CASH Pill Badge */}
          <rect x="90" y="35" width="120" height="25" rx="12.5" fill="#ffffff" opacity="0.95" />
          <text
            x="150"
            y="52"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-bold)" }}
            fontSize="12"
            fill="#047857"
            letterSpacing="0.5"
          >
            ✦ REAL CASH ✦
          </text>

          {/* Large Dynamic Rate Text in Center */}
          <text
            x="150"
            y="114"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-black)" }}
            fontSize={fontSize}
            fill="#ffffff"
            letterSpacing="-1"
          >
            {amount}
          </text>

          {/* Bottom CASHBACK Label with Decorative Speed Dashes */}
          <path d="M 72 136 L 90 132 M 75 142 L 93 138" stroke="#a7f3d0" strokeWidth="2.2" strokeLinecap="round" />
          <text
            x="150"
            y="143"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-extrabold)" }}
            fontSize="15"
            fill="#ffffff"
            letterSpacing="2.5"
          >
            CASHBACK
          </text>
          <path d="M 228 132 L 210 136 M 225 138 L 207 142" stroke="#a7f3d0" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* 3D Gold Coins Group (Bottom Right) */}
        <g transform="translate(230, 125)" filter="url(#coinShadow)">
          {/* Coin 1 (Bottom stacked horizontal coin) */}
          <path
            d="M 10 40 C 10 31 32 25 58 25 C 84 25 106 31 106 40 V 49 C 106 58 84 64 58 64 C 32 64 10 58 10 49 Z"
            fill="url(#goldDark)"
          />
          <ellipse cx="58" cy="40" rx="48" ry="15" fill="url(#gold1)" />
          <ellipse cx="58" cy="40" rx="44" ry="12" fill="none" stroke="#fef08a" strokeWidth="1.8" opacity="0.85" />

          {/* Coin 2 (Front upright standing 3D coin) */}
          <g transform="translate(32, -6) rotate(14 36 36)">
            {/* Rim / thickness */}
            <circle cx="38" cy="40" r="35" fill="url(#goldDark)" />
            {/* Front Face */}
            <circle cx="36" cy="37" r="35" fill="url(#gold1)" />
            <circle cx="36" cy="37" r="31" fill="none" stroke="#fef08a" strokeWidth="2.6" opacity="0.9" />
            <circle cx="36" cy="37" r="29" fill="url(#goldDark)" opacity="0.12" />
            {/* Embossed Rupee Symbol */}
            <text
              x="36"
              y="49"
              textAnchor="middle"
              style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-black)" }}
              fontSize="36"
              fill="#92400e"
            >
              ₹
            </text>
            {/* Specular Highlight Arc */}
            <path
              d="M 14 26 A 30 30 0 0 1 48 10"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.75"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

export function CashbackCard({ offer }: CashbackCardProps) {
  const isCashbackEnabled = useCashbackVisibility()
  if (!isCashbackEnabled) return null
  return <CashbackCardContent offer={offer} />
}

function CashbackCardContent({ offer }: CashbackCardProps) {
  const [logoError, setLogoError] = useState(false)
  const merchantName = offer.merchant || "Featured Partner"
  const merchantKey = merchantName.toLowerCase().replace(/[^a-z0-9-]/g, "")
  const theme = brandThemes[merchantKey] || {
    gradient: "from-purple-800 via-indigo-800 to-purple-900",
    text: "text-purple-700",
    bg: "bg-purple-800",
  }

  const logo = getBrandLogo(merchantName)
  const { prefix, amount } = parseCashbackRate(offer.cashbackRate)

  // Subtitle condition description
  const cleanDesc = (offer.description || "").replace(/[?]/g, "₹").trim()
  const conditionText =
    cleanDesc && cleanDesc.length > 5 && !cleanDesc.toLowerCase().includes("activate cashback")
      ? cleanDesc
      : "on All Valid Orders"

  // Step 1 copy: extract threshold spend if specified in terms, else default to ₹250
  const spendMatch = cleanDesc.match(/([₹$€£]\s*\d+)/)
  const minSpend = spendMatch ? spendMatch[1] : "₹250"

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 lg:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.12)] hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 overflow-hidden">
      {/* Subtle ambient lilac corner glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-52 h-52 rounded-full bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-colors" />

      {/* TOP COMPARTMENT: 3 Columns (Logo | Headlines | 3D Ticket Voucher) */}
      <div className="relative z-10 flex items-center justify-between gap-3.5 sm:gap-6">
        {/* 1. Large Brand Logo Icon Box */}
        <div
          className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shrink-0 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 flex items-center justify-center overflow-hidden shadow-lg bg-gradient-to-br ${theme.gradient} transition-transform duration-300 group-hover:scale-105`}
        >
          {/* Glass sheen highlight overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-2xl sm:rounded-3xl" />

          {logo && !logoError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={merchantName}
              className="relative z-10 w-full h-full object-contain drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-white text-center">
              <span className="text-4xl font-black drop-shadow-md tracking-tight">
                {merchantName.charAt(0)}
              </span>
              <span className="text-xs font-bold tracking-widest uppercase opacity-90 mt-0.5 line-clamp-1 max-w-[80px]">
                {merchantName}
              </span>
            </div>
          )}
        </div>

        {/* 2. Middle Offer Details & Big Headline */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Top row: Merchant Name & Active Badge */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest truncate">
              {merchantName}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
              <Zap className="h-3 w-3 fill-emerald-500 text-emerald-600 dark:text-emerald-400" />
              Active
            </span>
          </div>

          {/* Headline: Flat ₹50 / Cashback */}
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            <span>{prefix} </span>
            <span className="text-purple-700 dark:text-purple-400 font-bold">{amount}</span>
            <span className="block font-bold text-slate-900 dark:text-white">Cashback</span>
          </div>

          {/* Condition text */}
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {conditionText}
          </p>
        </div>

        {/* 3. Right: 3D Real Cash Ticket Graphic with Gold Coins */}
        <div className="hidden sm:flex sm:w-36 md:w-48 lg:w-56 shrink-0 items-center justify-end">
          <CashbackVoucherGraphic amount={amount} />
        </div>
      </div>

      {/* MIDDLE COMPARTMENT: 3 Step Informational Strip */}
      <div className="relative z-10 mt-4 sm:mt-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 dark:divide-slate-700/60">
        {/* Step 1: Minimum order condition */}
        <div className="flex items-center gap-2.5 sm:gap-3 pt-0 md:px-2">
          <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
            Flat cashback on valid orders above{" "}
            <strong className="text-slate-900 dark:text-white font-extrabold">{minSpend}</strong>.
          </p>
        </div>

        {/* Step 2: Tracking / Credited window */}
        <div className="flex items-center gap-2.5 sm:gap-3 pt-2.5 md:pt-0 md:px-2">
          <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
            Cashback will be credited to your account{" "}
            <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">within 24 hours</strong>.
          </p>
        </div>

        {/* Step 3: Wallet / Next Order */}
        <div className="flex items-center gap-2.5 sm:gap-3 pt-2.5 md:pt-0 md:px-2">
          <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
            Use cashback on your{" "}
            <strong className="text-slate-900 dark:text-white font-extrabold">next order</strong> or transfer to{" "}
            <strong className="text-slate-900 dark:text-white font-extrabold">Bank/UPI</strong>.
          </p>
        </div>
      </div>

      {/* BOTTOM COMPARTMENT: Full-width Prominent CTA Button */}
      <a
        href={`/out?url=${encodeURIComponent(offer.affiliateUrl)}&merchant=${encodeURIComponent(merchantKey)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 mt-4 flex items-center justify-center gap-2.5 w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-purple-700 hover:bg-purple-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 group/btn"
      >
        <span>Activate Cashback</span>
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:translate-x-1.5 transition-transform duration-200" />
      </a>
    </article>
  )
}
