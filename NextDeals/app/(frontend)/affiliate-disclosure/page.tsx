import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { DollarSign, ExternalLink, ShieldCheck } from "lucide-react"
import { getCmsPage } from "@/lib/cms-settings"

export const metadata: Metadata = {
  title: "Affiliate Disclosure | CouponKodee",
  description: "Read the CouponKodee Affiliate Disclosure to learn how we earn commissions through affiliate links at zero cost to you.",
}

export default async function AffiliateDisclosurePage() {
  const cmsPage = await getCmsPage("affiliate-disclosure")

  const title = cmsPage?.title || "Affiliate Disclosure"

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
        ]}
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground">{cmsPage?.subtitle || "Compliance & Transparency Policy"}</p>
        </div>

        {cmsPage?.body ? (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {cmsPage.body}
          </div>
        ) : (
          <>
            <div className="border border-primary/20 bg-primary/5 rounded-xl p-6">
              <p className="text-base text-foreground font-medium leading-relaxed">
                In compliance with Federal Trade Commission (FTC) guidelines, the Advertising Standards Council of India (ASCI), and standard online marketing transparency practices, please assume that any links leading to external retailers on CouponKodee are affiliate links.
              </p>
            </div>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="border rounded-xl p-6 bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ExternalLink className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">What is an Affiliate Link?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An affiliate link is a unique tracking URL provided by affiliate networks or merchants. When you click it, a cookie is temporarily placed in your browser so the retailer knows you came from CouponKodee.
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Zero Cost to You</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Purchasing through our links will <strong>never</strong> cost you anything extra. The commission is paid completely by the merchant from their marketing budget. In fact, our coupon codes often help you pay less!
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Editorial Independence</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our deal recommendations and editorial rankings are based on genuine savings value for shoppers. We only feature stores and deals that meet our quality and legitimacy standards.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Affiliate Programs We Participate In</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            CouponKodee participates in various affiliate marketing programs, including but not limited to Amazon Associates, Flipkart Affiliate Program, Cuelinks, vCommission, Impact, CJ Affiliate, and Rakuten Marketing. As an affiliate, we earn from qualifying purchases made through our referral links.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Amazon Associates Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            CouponKodee is a participant in the Amazon Services LLC Associates Program and Amazon Associates India, affiliate advertising programs designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in, Amazon.com, and affiliated sites.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Questions?</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            If you have questions regarding our affiliate relationships or would like more information, feel free to contact us at{" "}
            <a href="mailto:affiliates@couponkodee.com" className="text-primary hover:underline">
              affiliates@couponkodee.com
            </a>.
          </p>
        </section>
          </>
        )}
      </div>
    </div>
  )
}

