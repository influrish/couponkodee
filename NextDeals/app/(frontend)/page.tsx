import Link from "next/link"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { HomeHero } from "@/components/home-hero"
import { HomeDynamicContent } from "@/components/home-dynamic-content"
import { CouponCard } from "@/components/coupon-card"
import { CashbackCard } from "@/components/cashback-card"
import { DealCard } from "@/components/deal-card"
import { StoreOfferCard } from "@/components/store-offer-card"
import { getPayloadClient } from "@/src/lib/payload"
import { getSiteSettingsData } from "@/lib/cms-settings"
import { getAllStores, getStoreOffers } from "@/lib/stores-data"
import { getDbStores, getDbPopularStores } from "@/lib/db-stores"
import { getBrandLogo } from "@/lib/brand-logos"
import { getCategoryImageUrl } from "@/lib/category-images"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Gift,
  Heart,
  HelpCircle,
  Home,
  Plane,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tag,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react"

// ISR: Revalidate every 60 seconds
export const revalidate = 60

interface HomePageProps {
  searchParams: Promise<{ q?: string }>
}

const categoryIconMap: Record<string, any> = {
  electronics: Smartphone,
  fashion: ShoppingBag,
  food: Utensils,
  travel: Plane,
  "health-beauty": Heart,
  beauty: Heart,
  "home-garden": Home,
  home: Home,
  grocery: ShoppingCart,
}

const defaultCategories = [
  { name: "Beauty & Grooming", slug: "beauty", image: "/categories/beauty.png" },
  { name: "Fashion", slug: "fashion", image: "/categories/fashion.png" },
  { name: "Min 50% Cashback", slug: "cashback", image: "/categories/cashback.png", href: "/deals" },
  { name: "Departmental", slug: "electronics", image: "/categories/electronics.png" },
  { name: "Home & Kitchen", slug: "home", image: "/categories/home.png" },
  { name: "Food & Grocery", slug: "grocery", image: "/categories/grocery.png" },
  { name: "Travel & Flights", slug: "travel", image: "/categories/travel.png" },
]

const faqs = [
  {
    q: "How does CouponKodee Cashback work?",
    a: "When you click our link to visit a store and make a purchase, the retailer pays us an affiliate commission. Instead of keeping it all, we share the majority of this money directly with you as Cashback! Once confirmed, you can transfer your cashback directly to your bank account or UPI.",
  },
  {
    q: "Are the coupon codes and discounts completely free to use?",
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

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams
  const searchTerm = q?.trim()

  const siteSettings = await getSiteSettingsData()
  const isCashbackEnabled = siteSettings.cashbackVisibility === "on"

  let featuredProducts: any[] = []
  let coupons: any[] = []
  let cashbacks: any[] = []
  let activeCategories = isCashbackEnabled
    ? defaultCategories
    : defaultCategories.filter((c) => c.slug !== "cashback")
  let popularStoresList = await getDbPopularStores()

  try {
    const payload = await getPayloadClient()

    const productFilter: any = searchTerm
      ? {
          or: [
            { title: { contains: searchTerm } },
            { shortDescription: { contains: searchTerm } },
          ],
        }
      : { "status.isActive": { equals: true } }

    // 1. Featured Deals from DB (Prioritize isFeatured)
    const prodResult = await payload.find({
      collection: "products",
      where: {
        and: [productFilter, { "status.isActive": { equals: true } }],
      },
      limit: 8,
      sort: ["-status.isFeatured", "-createdAt"],
    })
    featuredProducts = prodResult.docs

    // 2. Verified Coupons from DB (Prioritize isFeatured)
    const couponFilter: any = searchTerm
      ? {
          or: [
            { title: { contains: searchTerm } },
            { merchant: { contains: searchTerm } },
            { code: { contains: searchTerm } },
          ],
        }
      : { isActive: { equals: true } }

    const couponResult = await payload.find({
      collection: "coupon-offers",
      where: {
        and: [couponFilter, { isActive: { equals: true } }],
      },
      limit: 8,
      sort: ["-isFeatured", "-sortOrder", "-createdAt"],
    })
    coupons = couponResult.docs

    // 3. Cashback Offers from DB (Prioritize isFeatured)
    const cashResult = await payload.find({
      collection: "cashback-offers",
      where: { isActive: { equals: true } },
      limit: 6,
      sort: ["-isFeatured", "-sortOrder", "-createdAt"],
    })
    cashbacks = cashResult.docs

    // 4. Categories from DB
    const catResult = await payload.find({
      collection: "categories",
      where: { isActive: { equals: true } },
      limit: 12,
      sort: ["level", "sortOrder", "name"],
    })
    if (catResult.docs.length > 0) {
      const seen = new Set<string>()
      const list: any[] = []

      catResult.docs.forEach((c: any) => {
        const canonicalKey = c.slug === "health-beauty" ? "beauty" : c.slug === "home-garden" ? "home" : c.slug
        if (seen.has(canonicalKey)) return
        seen.add(canonicalKey)

        let displayName = c.name
        if (c.slug === "beauty" || c.slug === "health-beauty") displayName = "Beauty & Grooming"
        else if (c.slug === "grocery") displayName = "Food & Grocery"
        else if (c.slug === "home" || c.slug === "home-garden") displayName = "Home & Kitchen"
        else if (c.slug === "electronics") displayName = "Departmental"

        list.push({
          name: displayName,
          slug: c.slug,
          image: c.image?.url || getCategoryImageUrl(c.slug, c.name),
        })
      })

      if (isCashbackEnabled && !seen.has("cashback")) {
        list.push({
          name: "Min 50% Cashback",
          slug: "cashback",
          image: "/categories/cashback.png",
          href: "/deals",
        })
      }

      const preferredOrder = ["beauty", "fashion", "cashback", "electronics", "home", "grocery", "travel", "food"]
      list.sort((a, b) => {
        const keyA = a.slug === "health-beauty" ? "beauty" : a.slug === "home-garden" ? "home" : a.slug
        const keyB = b.slug === "health-beauty" ? "beauty" : b.slug === "home-garden" ? "home" : b.slug
        const idxA = preferredOrder.indexOf(keyA)
        const idxB = preferredOrder.indexOf(keyB)
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB)
      })

      activeCategories = (!isCashbackEnabled ? list.filter((c) => c.slug !== "cashback") : list).slice(0, 7)
    }
  } catch {
    // If database is empty or offline, fallback to static dataset
  }

  // Stores with strictly verified offer counts
  const allStores = await getDbStores(isCashbackEnabled)

  if (coupons.length === 0) {
    const fallbackCoupons = allStores.flatMap((store) => {
      const offers = store.offers || getStoreOffers(store)
      return offers
        .filter((o) => o.type === "coupon" && o.code)
        .map((o) => ({
          id: o.id,
          title: o.title,
          description: o.description,
          merchant: store.name,
          code: o.code,
          discount: o.discount,
          affiliateUrl: o.affiliateUrl,
          isVerified: o.isVerified,
        }))
    })
    coupons = fallbackCoupons.slice(0, 8)
  }

  if (cashbacks.length === 0) {
    const fallbackCashbacks = allStores
      .filter((s) => s.hasCashback && s.cashbackRate)
      .map((s) => ({
        id: `cb-${s.id}`,
        title: `Earn ${s.cashbackRate} on All Valid Orders`,
        description: s.cashbackTerms || `Activate cashback before shopping at ${s.name} to receive rewards.`,
        merchant: s.name,
        cashbackRate: s.cashbackRate || "Earn Cashback",
        affiliateUrl: s.affiliateUrl,
        isVerified: true,
      }))
    cashbacks = fallbackCashbacks.slice(0, 6)
  }

  return (
    <div className="couponkodee-home">
      {/* 1. HERO SECTION (Dynamic by Country & CMS) */}
      <HomeHero searchTerm={searchTerm} heroSettings={siteSettings.hero} />

      {/* 2, 4, 5, 6: REGIONAL STORES, COUPONS, CASHBACK & DEALS (Dynamic by Country) */}
      <HomeDynamicContent
        allStores={allStores}
        initialCoupons={coupons}
        initialCashbacks={cashbacks}
        initialDeals={featuredProducts}
        searchTerm={searchTerm}
      />

      <div className="container mx-auto px-4">
        {/* 3. CATEGORIES SECTION */}
        <section id="categories" className="section-block section-block--tight">
          <div className="section-heading">
            <div>
              <p className="section-kicker">SHOP BY INTEREST</p>
              <h2>Top Categories</h2>
            </div>
            <Link href="/categories" className="section-link hidden sm:inline-flex">
              View all categories <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex md:grid md:grid-cols-7 items-start justify-start md:justify-items-center gap-5 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible pb-4 pt-2 px-2 no-scrollbar scroll-smooth">
            {activeCategories.map((category: any) => {
              const imgUrl = category.image || getCategoryImageUrl(category.slug, category.name)
              const href = category.href || `/category/${category.slug}`
              return (
                <Link
                  href={href}
                  className="group flex flex-col items-center flex-shrink-0 w-24 sm:w-28 md:w-32 cursor-pointer text-center no-underline transition-transform"
                  key={category.slug}
                >
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex items-center justify-center p-0 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-[0_10px_25px_rgba(124,58,237,0.18)]">
                    <img
                      src={imgUrl}
                      alt={category.name}
                      width={112}
                      height={112}
                      className="w-full h-full object-contain select-none transition-transform duration-300 group-hover:scale-105"
                      loading="eager"
                    />
                  </div>
                  <span className="text-[13px] sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 text-center leading-tight mt-3 max-w-[96px] sm:max-w-[110px] break-words group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                    {category.name}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Mobile-only "View all categories →" Button (Beneath Categories) */}
          <div className="mt-3.5 sm:hidden flex justify-center">
            <Link
              href="/categories"
              className="section-link w-full justify-center py-2.5"
            >
              View All Categories <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* 7. HOW IT WORKS (Configurable in Admin) */}
        <section id="how-it-works" className="section-block">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="section-kicker justify-center">{siteSettings.howItWorks.kicker || "EASY AS 1, 2, 3"}</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              {siteSettings.howItWorks.title}
            </h2>
            <p className="text-[15px] text-slate-600 mt-2">
              {!isCashbackEnabled
                ? siteSettings.howItWorks.subtitle.replace(/and automatic cashback tracking\.?/gi, "and instant coupon discounts.")
                : siteSettings.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {siteSettings.howItWorks.steps.map((rawStep, idx) => {
              const bgColors = [
                "bg-purple-100 text-purple-700",
                "bg-amber-100 text-amber-700",
                "bg-emerald-100 text-emerald-700",
                "bg-blue-100 text-blue-700",
              ]
              const colorClass = bgColors[idx % bgColors.length]
              let title = rawStep.title
              let description = rawStep.description

              if (!isCashbackEnabled) {
                if (idx === 0) {
                  description = description.replace(/or cashback link\s*/gi, "")
                } else if (idx === 2 || title.toLowerCase().includes("cashback")) {
                  title = "Enjoy Instant Savings"
                  description = "Save money instantly with verified promo codes and discount deals applied directly at checkout."
                }
              }

              return (
                <div key={idx} className="step-card flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center font-black text-xl mb-4 shadow-sm`}>
                    {rawStep.stepNumber || idx + 1}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-2">{title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ - Configurable in Admin) */}
        <section id="faqs" className="section-block">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="section-kicker justify-center">GOT QUESTIONS?</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              {siteSettings.faqs.title}
            </h2>
            <p className="text-[15px] text-slate-600 mt-2">
              {!isCashbackEnabled
                ? siteSettings.faqs.subtitle.replace(/and earning cashback\.?/gi, "and finding the best discounts.")
                : siteSettings.faqs.subtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3.5">
            {siteSettings.faqs.items
              .filter((faq) => {
                if (!isCashbackEnabled) {
                  const q = faq.q.toLowerCase()
                  if (q.includes("cashback")) return false
                }
                return true
              })
              .map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-sm text-slate-800 hover:text-purple-700">
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-purple-600 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="mt-3 text-xs text-slate-600 leading-relaxed pl-6.5 border-t border-slate-100 pt-3">
                    {!isCashbackEnabled
                      ? faq.a.replace(/,\s*or earn cashback/gi, "").replace(/or earn cashback/gi, "")
                      : faq.a}
                  </div>
                </details>
              ))}
          </div>
        </section>

        {/* 9. NEWSLETTER SUBSCRIPTION (Configurable in Admin) */}
        <NewsletterSignup
          heading={siteSettings.newsletter.heading}
          subtitle={
            !isCashbackEnabled
              ? siteSettings.newsletter.subtitle.replace(/,\s*fresh deal or cashback offer/gi, " or fresh deal").replace(/or cashback offer/gi, "")
              : siteSettings.newsletter.subtitle
          }
          buttonText={siteSettings.newsletter.buttonText}
        />
      </div>
    </div>
  )
}
