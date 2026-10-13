import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { Mail, MessageSquare, MapPin } from "lucide-react"
import { getSiteSettingsData, getCmsPage } from "@/lib/cms-settings"

export const metadata: Metadata = {
  title: "Contact Us | CouponKodee",
  description: "Get in touch with the CouponKodee team for inquiries, merchant partnerships, or support.",
}

export default async function ContactPage() {
  const siteSettings = await getSiteSettingsData()
  const cmsPage = await getCmsPage("contact")

  const title = cmsPage?.title || "Contact Us"
  const subtitle =
    cmsPage?.subtitle ||
    "Have a question, feedback about a coupon, or interested in partnering with CouponKodee? We'd love to hear from you."

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Contact Us", href: "/contact" },
        ]}
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
          {cmsPage?.body && (
            <div className="mt-4 prose prose-slate max-w-none text-muted-foreground whitespace-pre-wrap">
              {cmsPage.body}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="border rounded-xl p-6 bg-card text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Email Support</h3>
            <p className="text-xs text-muted-foreground mb-3">General inquiries & deal reports</p>
            <a
              href={`mailto:${siteSettings.contact.supportEmail}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {siteSettings.contact.supportEmail}
            </a>
          </div>

          <div className="border rounded-xl p-6 bg-card text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Partnerships</h3>
            <p className="text-xs text-muted-foreground mb-3">Merchants & Affiliate Networks</p>
            <a
              href={`mailto:${siteSettings.contact.partnershipsEmail}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {siteSettings.contact.partnershipsEmail}
            </a>
          </div>

          <div className="border rounded-xl p-6 bg-card text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Headquarters</h3>
            <p className="text-xs text-muted-foreground mb-3">Operating across India & Global</p>
            <span className="text-sm font-medium text-foreground text-center">
              {siteSettings.contact.address}
            </span>
          </div>
        </div>

        <section className="border rounded-xl p-8 bg-card space-y-6">
          <h2 className="text-2xl font-bold">Send us a Message</h2>
          <p className="text-sm text-muted-foreground">
            Fill out the form below and our team will get back to you within 24-48 business hours.
          </p>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="How can we help?"
                className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us what's on your mind..."
                className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              className="px-6 py-2 bg-primary text-primary-foreground font-medium text-sm rounded-md hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
