import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { getCmsPage } from "@/lib/cms-settings"

export const metadata: Metadata = {
  title: "Terms of Service | CouponKodee",
  description: "Read the Terms of Service governing the use of CouponKodee and its coupon aggregation services.",
}

export default async function TermsPage() {
  const cmsPage = await getCmsPage("terms")

  const title = cmsPage?.title || "Terms of Service"

  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Terms of Service", href: "/terms" },
        ]}
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground">{cmsPage?.subtitle || "Last updated: September 2026"}</p>
        </div>

        {cmsPage?.body ? (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {cmsPage.body}
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                By accessing or using CouponKodee (&quot;the Website&quot;), you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions herein, you must discontinue using the Website immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                CouponKodee provides a digital directory of promotional offers, coupons, voucher codes, discounts, and product deals offered by third-party retailers. CouponKodee does not sell any goods or services directly to consumers and does not process payments or orders.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">3. Accuracy of Deals and Offers</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                While we strive to keep coupons and product pricing completely accurate and current, discounts, promotional periods, inventory, and terms are subject to change without notice by the merchants. CouponKodee does not warrant that codes, prices, discounts, or terms displayed are error-free or guaranteed to apply at checkout.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                All original content, designs, logos, and software code on CouponKodee are the exclusive property of CouponKodee and are protected by applicable intellectual property laws. Store brand names, retailer logos, and trademarks displayed on the Website belong to their respective owners.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                In no event shall CouponKodee or its affiliates be liable for any indirect, incidental, punitive, or consequential damages resulting from the use or inability to use the Website, or from purchases made through merchant links found on CouponKodee.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">6. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We reserve the right to revise these Terms of Service at any time. Your continued use of the Website after any modifications signifies your acceptance of the updated terms.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  )
}


