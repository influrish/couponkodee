import type { Metadata } from "next"
import { getDbStores } from "@/lib/db-stores"
import { getCashbackVisibility } from "@/lib/cms-settings"
import { Breadcrumb } from "@/components/breadcrumb"
import { StoresExplorer } from "@/components/stores-explorer"
import {
  BadgeCheck,
  CircleDollarSign,
  HelpCircle,
  Percent,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react"

export const metadata: Metadata = {
  title: "All Stores & Brands | CouponKodee - Verified Coupons & Exclusive Deals",
  description:
    "Browse 500+ top Indian and international online stores. Find verified coupon codes and exclusive discount vouchers.",
}

// ISR revalidation
export const revalidate = 60

export default async function StoresPage() {
  const isCashbackEnabled = await getCashbackVisibility()
  const stores = await getDbStores(isCashbackEnabled)

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "All Stores", href: "/stores" },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 2. All Stores Title + Short Description */}
        <section className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 text-purple-800 px-3 py-1 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Complete Store Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Browse All Partner Stores
          </h1>
          <p className="mt-2 text-[15.5px] text-slate-700 leading-relaxed">
            Discover verified coupons, promo codes, price drops, and {isCashbackEnabled ? "highest cashback rates" : "exclusive deals"} from {stores.length}+ leading retailers like Amazon, Flipkart, Myntra, Swiggy, and Ajio.
          </p>
        </section>

        {/* 3. Stores Explorer (Search, Categories, Filters, Alphabet, Grid, Load More) */}
        <StoresExplorer stores={stores} />

        {/* 4. Short SEO Section */}
        <section className="mt-16 pt-10 border-t border-slate-200">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="max-w-3xl">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
                Shop Smarter &amp; {isCashbackEnabled ? "Earn Cashback" : "Save More"} on Every Store
              </h2>
              <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed mb-6">
                CouponKodee partners directly with over 500 top e-commerce platforms, food apps, fashion brands, electronics retailers, and travel booking services across India. Whenever you start your shopping journey by clicking our store links or applying our verified coupon codes, you guarantee yourself maximum savings.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                    <span>100% Tested Codes</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our team verifies coupons every 24 hours so you never face expired or broken codes.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    {isCashbackEnabled ? (
                      <>
                        <CircleDollarSign className="h-4 w-4 text-emerald-600" />
                        <span>Real Bank Cashback</span>
                      </>
                    ) : (
                      <>
                        <Percent className="h-4 w-4 text-emerald-600" />
                        <span>Instant Savings</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isCashbackEnabled
                      ? "Earn real cash rewards that transfer directly to your bank account or UPI with zero fees."
                      : "Save money instantly with hand-tested promo codes and discounts applied directly at checkout."}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>Exclusive Store Perks</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Special welcome discounts, secret sales, and bank card offers updated round the clock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

