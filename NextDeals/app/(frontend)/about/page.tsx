import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { ShieldCheck, Sparkles, Tag, Users } from "lucide-react"
import { getCmsPage } from "@/lib/cms-settings"

export const metadata: Metadata = {
  title: "About Us | CouponKodee",
  description: "Learn more about CouponKodee, our mission to help shoppers save money with verified coupons and curated deals.",
}

export default async function AboutPage() {
  const cmsPage = await getCmsPage("about")

  const title = cmsPage?.title || "About CouponKodee"
  const subtitle =
    cmsPage?.subtitle ||
    "Welcome to CouponKodee — your trusted destination for genuine online discounts, verified promo codes, and hand-curated shopping deals across leading brands and stores."

  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
        ]}
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        {cmsPage?.body ? (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {cmsPage.body}
          </div>
        ) : (
          <>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="border rounded-xl p-6 bg-card">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">100% Verified Deals</h3>
            <p className="text-sm text-muted-foreground">
              Every coupon and discount code listed on CouponKodee is tested and updated regularly by our editorial team so you never encounter expired deals.
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Tag className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hundreds of Stores</h3>
            <p className="text-sm text-muted-foreground">
              From top electronics retailers and fashion destinations to food delivery and travel bookings, find all your favorite shopping platforms in one place.
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real Savings</h3>
            <p className="text-sm text-muted-foreground">
              We monitor price drops, exclusive festive promotions, and flash sales around the clock to ensure you always get the lowest price possible.
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Shopper-Centric</h3>
            <p className="text-sm text-muted-foreground">
              Our service is 100% free for users. We are supported by our merchant partners, allowing us to keep all savings tools open to everyone.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is simple: to make every shopping rupee stretch further. We believe savvy shopping shouldn&apos;t involve jumping through hurdles or wasting time on invalid voucher codes. We combine automated deal tracking with human curation to deliver an honest, transparent savings experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How We Work</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you find a deal or coupon code on CouponKodee and click through to complete your purchase on a partner merchant site, we may earn an affiliate commission at no extra cost to you. This support enables us to maintain and enhance our service, expand merchant integrations, and keep all coupons free for our community.
          </p>
        </section>
          </>
        )}
      </div>
    </div>
  )
}

