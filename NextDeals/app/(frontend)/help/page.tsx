import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { HelpCircle, Search, ShoppingBag, AlertCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Help Center | CouponKodee",
  description: "Find helpful guides and tips on how to save money, find coupons, and troubleshoot promo codes on CouponKodee.",
}

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Help Center", href: "/help" },
        ]}
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Need guidance navigating deals or redeeming coupons? Explore our help topics and quick answers below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="border rounded-xl p-6 bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Finding the Best Deals</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use the search bar on our homepage to look up specific stores (e.g. Amazon, Flipkart, Nike) or browse categories to explore current discounts across fashion, electronics, travel, and more.
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Using Coupon Codes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Clicking a coupon will copy the discount code to your clipboard and open the retailer website in a new tab. Paste the copied code into the promotional box at checkout before finalizing payment.
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Troubleshooting Promo Codes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If a promo code doesn't apply, check the code's terms for minimum cart values, eligible categories, or user limits (e.g. valid only for first-time shoppers).
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Reporting Broken Offers</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Spot an expired offer? We appreciate your help keeping CouponKodee accurate. Send us a quick note via our{" "}
              <Link href="/contact" className="text-primary hover:underline font-medium">contact form</Link>{" "}
              and we will investigate right away.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Topics</h2>
          <p className="text-muted-foreground leading-relaxed">
            For specific inquiries regarding store-specific return policies, product warranties, or order delivery, please reach out directly to the merchant from whom you purchased the items, as CouponKodee does not fulfill or process retail orders.
          </p>
        </section>
      </div>
    </div>
  )
}

