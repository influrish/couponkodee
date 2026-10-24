import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { getCmsPage } from "@/lib/cms-settings"

export const metadata: Metadata = {
  title: "Privacy Policy | CouponKodee",
  description: "Read the CouponKodee Privacy Policy to understand how we collect, use, and protect your information.",
}

export default async function PrivacyPage() {
  const cmsPage = await getCmsPage("privacy")

  const title = cmsPage?.title || "Privacy Policy"

  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy" },
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
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            At CouponKodee (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to safeguarding your personal privacy. This Privacy Policy explains what information we collect when you use our website, how we use and protect it, and your rights concerning your personal data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We collect minimal personal data to provide our savings services:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li><strong>Voluntary Information:</strong> When you subscribe to our newsletter or contact us via our support form, we collect your email address, name, and any messages you submit.</li>
            <li><strong>Automated Usage Data:</strong> When you visit our site, our servers automatically log standard information including your IP address, browser type, referring pages, device information, and pages visited.</li>
            <li><strong>Cookies & Tracking Technologies:</strong> We use cookies to remember preferences, analyze website traffic, and track affiliate clicks to partner stores.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We use the information collected to:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>Provide, maintain, and optimize our coupon and deal aggregation platform.</li>
            <li>Send periodic newsletters, deal alerts, and promotional communications if you have opted in.</li>
            <li>Attribute affiliate referrals when you click external links to partner merchants.</li>
            <li>Detect and prevent fraudulent or abusive activity.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Third-Party Links & Affiliate Partners</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            CouponKodee contains outbound links to third-party merchant and affiliate networks. When you click on an external deal link, you leave our website and are directed to the retailer&apos;s site. These third-party websites maintain their own independent privacy policies, which we encourage you to review.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We implement industry-standard technical and organizational security measures to protect your personal information against unauthorized access, loss, or misuse.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            If you have questions regarding this Privacy Policy or wish to request data deletion, please contact us at{" "}
            <a href="mailto:privacy@couponkodee.com" className="text-primary hover:underline">
              privacy@couponkodee.com
            </a>.
          </p>
        </section>
          </>
        )}
      </div>
    </div>
  )
}

