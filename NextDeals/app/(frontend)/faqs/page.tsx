import type { Metadata } from "next"
import Link from "@/components/localized-link"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | CouponKodee",
  description: "Find answers to commonly asked questions about using CouponKodee coupons, promo codes, deals, and discounts.",
}

const faqs = [
  {
    question: "What is CouponKodee and is it free to use?",
    answer: "CouponKodee is a completely free coupon and deal discovery platform. We curate verified coupons, vouchers, discount codes, and special promotional offers from hundreds of leading online retailers so you can save money on every purchase.",
  },
  {
    question: "How do I redeem a coupon code?",
    answer: "Browse for the store or offer you want and click 'Get Code' or 'View Deal'. If a promo code is required, copy the code provided and paste it into the promo code or discount box at checkout on the merchant's website. If it is an automatic deal, clicking through will activate the discount directly.",
  },
  {
    question: "Why did a coupon code not work?",
    answer: "Coupons can fail for several reasons: they may have expired, reached maximum redemption limits, require a minimum cart value, or exclude specific brands or items in your cart. We constantly test codes, but if you find an invalid one, please let us know via our Contact page so we can update it immediately.",
  },
  {
    question: "Do I need to create an account to use coupons?",
    answer: "No account is required to view, copy, and use any coupon code or deal on CouponKodee. You can freely browse and claim offers anytime. You can also subscribe to our free newsletter to receive handpicked deals directly in your inbox.",
  },
  {
    question: "How does CouponKodee verify discount codes?",
    answer: "Our team regularly tests coupons directly on retailer checkout pages. We also monitor official store newsletters, brand partnerships, and community feedback to maintain an accurate and up-to-date repository of working deals.",
  },
  {
    question: "How does CouponKodee make money?",
    answer: "CouponKodee earns a small commission from partner stores when you click on our links and complete a qualifying purchase. This affiliate commission comes at zero cost to you and allows us to keep CouponKodee completely free.",
  },
]

export default function FAQsPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "FAQs", href: "/faqs" },
        ]}
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about using coupons, claiming deals, and shopping smarter with CouponKodee.
          </p>
        </div>

        <div className="space-y-6 my-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="border rounded-xl p-6 bg-muted/40 text-center space-y-3">
          <h3 className="font-semibold text-lg">Still have questions?</h3>
          <p className="text-sm text-muted-foreground">
            Can&apos;t find the answer you&apos;re looking for? Reach out to our friendly support team.
          </p>
          <Link
            href="/contact"
            className="inline-block px-5 py-2 bg-primary text-primary-foreground font-medium text-sm rounded-md hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

