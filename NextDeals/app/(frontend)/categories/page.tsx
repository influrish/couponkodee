import type { Metadata } from "next"
import Link from "@/components/localized-link"
import {
  getStoresByCategory,
  getStoreOffers,
  StoreItem,
} from "@/lib/stores-data"
import { getDbStores } from "@/lib/db-stores"
import { getCashbackVisibility } from "@/lib/cms-settings"
import { Breadcrumb } from "@/components/breadcrumb"
import { StoreOfferCard } from "@/components/store-offer-card"
import { getBrandLogo } from "@/lib/brand-logos"
import { StoreLogoImage } from "@/components/store-logo-image"
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Heart,
  Home,
  Percent,
  Plane,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tag,
  Utensils,
  Zap,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Browse All Shopping Categories | CouponKodee",
  description:
    "Explore coupons, promo codes, and cashback offers across all top shopping categories: Fashion, Electronics, Food, Travel, Beauty, Home, and Grocery.",
}

// ISR revalidation
export const revalidate = 60

const CATEGORY_LIST = [
  {
    slug: "fashion",
    name: "Fashion & Apparel",
    description: "Clothing, footwear, designer apparel & accessories from Myntra, Ajio, and H&M.",
    image: "/categories/fashion.png",
    icon: ShoppingBag,
    color: "bg-rose-50 text-rose-700 border-rose-200",
    badgeColor: "bg-rose-600",
  },
  {
    slug: "electronics",
    name: "Mobiles & Electronics",
    description: "Smartphones, laptops, headphones & home appliances from Amazon, Flipkart, and Samsung.",
    image: "/categories/electronics.png",
    icon: Smartphone,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    badgeColor: "bg-blue-600",
  },
  {
    slug: "food",
    name: "Food & Dining",
    description: "Online meal delivery, pizzas, burgers & restaurants from Swiggy, Zomato, and Domino's.",
    image: "/categories/food.png",
    icon: Utensils,
    color: "bg-orange-50 text-orange-700 border-orange-200",
    badgeColor: "bg-orange-600",
  },
  {
    slug: "travel",
    name: "Travel & Flights",
    description: "Domestic & international flights, hotels, and vacation packages from MakeMyTrip & Cleartrip.",
    image: "/categories/travel.png",
    icon: Plane,
    color: "bg-sky-50 text-sky-700 border-sky-200",
    badgeColor: "bg-sky-600",
  },
  {
    slug: "beauty",
    name: "Beauty & Wellness",
    description: "Cosmetics, skincare, perfumes, and health wellness from Nykaa, Tata 1mg, and Netmeds.",
    image: "/categories/beauty.png",
    icon: Heart,
    color: "bg-pink-50 text-pink-700 border-pink-200",
    badgeColor: "bg-pink-600",
  },
  {
    slug: "home",
    name: "Home & Living",
    description: "Furniture, decor, kitchen appliances & home improvements from Pepperfry and IKEA.",
    image: "/categories/home.png",
    icon: Home,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    badgeColor: "bg-amber-600",
  },
  {
    slug: "grocery",
    name: "Grocery & Essentials",
    description: "Daily essentials, fresh produce, and 10-minute grocery delivery from Zepto and Blinkit.",
    image: "/categories/grocery.png",
    icon: ShoppingCart,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    badgeColor: "bg-purple-600",
  },
]

export default async function CategoriesPage() {
  const isCashbackEnabled = await getCashbackVisibility()
  const allStores = await getDbStores(isCashbackEnabled)

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        variant="bar"
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
        ]}
      />

      <div className="container py-8">
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 text-purple-800 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Explore by Department
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Browse All Shopping Categories
          </h1>
          <p className="mt-2 text-md text-slate-700 leading-relaxed">
            {isCashbackEnabled
              ? "Find the best verified coupons, exclusive promo codes, and highest cashback rates organized by your favorite shopping interests."
              : "Find the best verified coupons and exclusive promo codes organized by your favorite shopping interests."}
          </p>
        </section>

        {/* 1. CATEGORY GRID CARDS */}
        <section className="mb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {CATEGORY_LIST.map((cat) => {
              const Icon = cat.icon
              const categoryStores = allStores.filter((s) => s.category === cat.slug)
              const totalOffers = categoryStores.reduce((acc, s) => acc + s.couponsCount, 0)
              const cashbackCount = categoryStores.filter((s) => s.hasCashback && s.cashbackRate).length

              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col justify-between p-6 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div>
                    {/* Top: Image & Store Count */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center p-0 group-hover:scale-105 transition-transform">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {categoryStores.length} stores
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {cat.name}
                    </h2>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-700">
                      {totalOffers} {totalOffers === 1 ? "active offer" : "active offers"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-600 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all">
                      Browse <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 2. CATEGORY SHOWCASES (Stores & Handpicked Offers) */}
        <div className="space-y-12">
          {CATEGORY_LIST.map((cat) => {
            const categoryStores = allStores.filter((s) => s.category === cat.slug)
            if (categoryStores.length === 0) return null

            // Get top 2 offers for this category
            const categoryOffers = categoryStores
              .flatMap((store) => {
                const storeOffers = store.offers || getStoreOffers(store)
                return storeOffers.map((o) => ({ ...o, merchant: store.name }))
              })
              .slice(0, 2)

            return (
              <section
                key={`section-${cat.slug}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.badgeColor}`} />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Department
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      {cat.name}
                    </h2>
                  </div>

                  <Link
                    href={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800"
                  >
                    <span>View all {cat.name} offers</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Popular Stores in this Category */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                    Popular Stores:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {categoryStores.map((store) => {
                      const logo = store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name)
                      return (
                        <Link
                          key={store.slug}
                          href={`/store/${store.slug}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-purple-50 hover:border-purple-200 text-xs font-bold text-slate-800 hover:text-purple-700 transition-colors"
                        >
                          <StoreLogoImage
                            src={logo}
                            alt={store.name}
                            initial={store.initial}
                            bg={store.bg}
                            size="xs"
                          />
                          <span>{store.name}</span>
                          {isCashbackEnabled && store.cashbackRate && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Cashback
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Top 2 Offers */}
                {categoryOffers.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                      Top Verified Deals:
                    </span>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                      {categoryOffers.map((offer) => (
                        <StoreOfferCard
                          key={offer.id}
                          offer={{
                            id: offer.id,
                            title: offer.title,
                            description: offer.description,
                            merchant: offer.merchant,
                            code: offer.code,
                            discount: offer.discount,
                            type: offer.type,
                            affiliateUrl: offer.affiliateUrl,
                            isVerified: offer.isVerified,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
