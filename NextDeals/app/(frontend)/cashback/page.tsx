import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getDbStores } from "@/lib/db-stores"
import { getCashbackVisibility } from "@/lib/cms-settings"
import { Breadcrumb } from "@/components/breadcrumb"
import { CashbackExplorer } from "@/components/cashback-explorer"
import { CashbackCard } from "@/components/cashback-card"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  HelpCircle,
  Percent,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Highest Cashback Offers & Rates | CouponKodee",
  description:
    "Earn extra cashback on top of store discounts from 500+ top Indian retailers. Transfer your real cash earnings directly to your bank account or UPI.",
}

// ISR revalidation
export const revalidate = 60

const cashbackFaqs = [
  {
    q: "How does CouponKodee Cashback work?",
    a: "When you click our link to visit a store and make a purchase, the retailer pays us an affiliate commission. Instead of keeping it all, we share the majority of this money directly with you as Cashback! Once confirmed, you can transfer your cashback directly to your bank account or UPI.",
  },
  {
    q: "Are the coupon codes and cashback completely free to earn?",
    a: "Yes, 100% free! You never have to pay anything to use CouponKodee, copy coupon codes, or earn cashback. There are no hidden fees or subscription charges.",
  },
  {
    q: "Can I use a coupon code AND still earn cashback?",
    a: "Absolutely! In most cases, you can apply our verified promo codes at the store's checkout to get an immediate discount, and you will still earn CouponKodee cashback on the final payable amount.",
  },
  {
    q: "How long does it take for cashback to show in my account?",
    a: "Cashback usually tracks automatically within 24 to 72 hours as 'Pending'. Once the store's return/cancellation window closes (typically 30–60 days), the status updates to 'Confirmed' and is available for instant withdrawal.",
  },
  {
    q: "How do I withdraw my confirmed Cashback?",
    a: "Once your confirmed cashback balance reaches the minimum threshold of ₹100, you can request an instant payout via direct Bank Transfer (NEFT) or UPI.",
  },
]

export default async function CashbackPage() {
  const isCashbackEnabled = await getCashbackVisibility()
  if (!isCashbackEnabled) {
    notFound()
  }

  const stores = await getDbStores()
  const cashbackStores = stores.filter((s) => s.hasCashback && s.cashbackRate)

  // Fetch Payload cashback offers if available
  let dbCashbackOffers: any[] = []
  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const cashbacksResult = await payload.find({
      collection: "cashback-offers",
      where: { isActive: { equals: true } },
      limit: 6,
      sort: "-createdAt",
    })
    dbCashbackOffers = cashbacksResult.docs
  } catch {
    // fallback
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cashback", href: "/cashback" },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 1. HERO CASHBACK BANNER */}
        <section className="mb-10 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 p-6 sm:p-10 md:p-12 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-200 mb-4 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              Real Bank-Transferable Money
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Earn Extra Cashback on Top of Store Discounts!
            </h1>
            <p className="mt-3 text-sm sm:text-base text-emerald-100 leading-relaxed">
              Shop through CouponKodee at your favorite stores and earn real money back. Transfer your earnings straight to your bank account via NEFT or UPI with zero fees.
            </p>

            {/* Quick Proof Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-300" /> 100% Free to Earn
              </span>
              <span className="flex items-center gap-1.5">
                <CircleDollarSign className="h-4 w-4 text-emerald-300" /> Direct Bank &amp; UPI
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-300" /> Up to 8.5% Cashback
              </span>
            </div>
          </div>
        </section>

        {/* 2. HOW CASHBACK WORKS (4 Simple Steps) */}
        <section className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
              EASY AS 1, 2, 3, 4
            </p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              How CouponKodee Cashback Works
            </h2>
            <p className="text-[15px] text-slate-600 mt-1">
              Four easy steps to turn your everyday shopping into real savings.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Pick a Store</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse our list of 500+ verified partner stores offering real cashback.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Activate Cashback</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click <em>&ldquo;Activate&rdquo;</em> to open the merchant store with tracked affiliate session.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Shop as Usual</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete your order and apply any coupon codes. Your cashback tracks in 24–72 hours.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto mb-3">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Withdraw Real Cash</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once confirmed, withdraw your balance directly to your Bank account or UPI with zero fees.
              </p>
            </div>
          </div>
        </section>

        {/* 3. FEATURED CASHBACK DEALS (from DB if available) */}
        {dbCashbackOffers.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  TOP OFFERS
                </p>
                <h2 className="text-xl font-black text-slate-900">
                  Featured Cashback Deals Today
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {dbCashbackOffers.map((offer) => (
                <CashbackCard key={offer.id} offer={offer} />
              ))}
            </div>
          </section>
        )}

        {/* 4. CASHBACK STORES EXPLORER */}
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
              EXPLORE PARTNERS
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Stores Offering Cashback ({cashbackStores.length})
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Click &ldquo;Activate&rdquo; to start your cashback session and redirect to the merchant.
            </p>
          </div>

          <CashbackExplorer stores={cashbackStores} />
        </section>

        {/* 5. FREQUENTLY ASKED QUESTIONS */}
        <section className="max-w-3xl mx-auto pt-6 border-t border-slate-200">
          <div className="text-center mb-8">
            <p className="text-xs font-black uppercase tracking-wider text-purple-700">
              HAVE QUESTIONS?
            </p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Cashback FAQ &amp; Withdrawal Rules
            </h2>
          </div>

          <div className="space-y-3">
            {cashbackFaqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between font-bold text-sm text-slate-800 hover:text-emerald-700">
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                </summary>
                <div className="mt-3 text-xs text-slate-600 leading-relaxed pl-6 border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
