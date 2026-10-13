import dotenv from "dotenv"
import { getPayload } from "payload"

dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env" })
const { default: config } = await import("../src/payload.config")

const sampleCategories = [
  { name: "Electronics", slug: "electronics", description: "Gadgets, phones, laptops and accessories.", shortDescription: "Gadgets & Tech", icon: "smartphone", color: "blue", isActive: true, isFeatured: true, level: 0, sortOrder: 1 },
  { name: "Fashion", slug: "fashion", description: "Clothing, shoes and accessories for every style.", shortDescription: "Style & Apparel", icon: "shirt", color: "purple", isActive: true, isFeatured: true, level: 0, sortOrder: 2 },
  { name: "Food & Dining", slug: "food", description: "Restaurants, meal delivery and cafe discounts.", shortDescription: "Food & Dining", icon: "activity", color: "orange", isActive: true, isFeatured: true, level: 0, sortOrder: 3 },
  { name: "Travel & Flights", slug: "travel", description: "Flights, hotel bookings and vacation deals.", shortDescription: "Travel & Hotels", icon: "bag", color: "indigo", isActive: true, isFeatured: true, level: 0, sortOrder: 4 },
  { name: "Health & Beauty", slug: "health-beauty", description: "Beauty, wellness, cosmetics and personal care.", shortDescription: "Beauty & Wellness", icon: "heart", color: "pink", isActive: true, isFeatured: true, level: 0, sortOrder: 5 },
  { name: "Home & Garden", slug: "home-garden", description: "Furniture, decor, appliances and garden essentials.", shortDescription: "Home & Living", icon: "home", color: "green", isActive: true, isFeatured: true, level: 0, sortOrder: 6 },
  { name: "Grocery & Daily", slug: "grocery", description: "Fresh produce, pantry staples and daily essentials.", shortDescription: "Grocery & Staples", icon: "camera", color: "yellow", isActive: true, isFeatured: true, level: 0, sortOrder: 7 },
]

const main = async () => {
  const payload = await getPayload({ config })
  const categories = new Map<string, string>()

  for (const category of sampleCategories) {
    const existing = await payload.find({ collection: "categories", where: { slug: { equals: category.slug } }, limit: 1 })
    const record = existing.docs[0] || await payload.create({ collection: "categories", data: category as any })
    categories.set(category.slug, String(record.id))
  }

  const products = [
    {
      title: "Noise Cancelling Wireless Bluetooth Headphones",
      slug: "noise-cancelling-wireless-headphones",
      shortDescription: "40-hour battery life with active hybrid noise cancellation.",
      category: categories.get("electronics"),
      brand: "AudioPro",
      pricing: { originalPrice: 7999, currentPrice: 3999, discountPercentage: 50 },
      affiliateUrl: "https://www.amazon.in/",
      merchant: "amazon",
      status: { isFeatured: true, isTrending: true, isActive: true },
    },
    {
      title: "Everyday Lightweight Running Sneakers",
      slug: "everyday-running-sneakers",
      shortDescription: "Breathable mesh upper with high-rebound cushioning.",
      category: categories.get("fashion"),
      brand: "Stride",
      pricing: { originalPrice: 4999, currentPrice: 2499, discountPercentage: 50 },
      affiliateUrl: "https://www.myntra.com/",
      merchant: "myntra",
      status: { isFeatured: true, isTrending: true, isActive: true },
    },
    {
      title: "Smart Ambient LED Desk Lamp with USB Charger",
      slug: "smart-led-desk-lamp",
      shortDescription: "Touch control brightness and 5 color temperature modes.",
      category: categories.get("home-garden"),
      brand: "GlowHome",
      pricing: { originalPrice: 2499, currentPrice: 1299, discountPercentage: 48 },
      affiliateUrl: "https://www.amazon.in/",
      merchant: "amazon",
      status: { isFeatured: true, isTrending: false, isActive: true },
    },
    {
      title: "Vitamin C Brightening Antioxidant Face Serum 30ml",
      slug: "vitamin-c-face-serum",
      shortDescription: "Formulated with 15% Ethyl Ascorbic Acid and Ferulic Acid.",
      category: categories.get("health-beauty"),
      brand: "PureGlow",
      pricing: { originalPrice: 999, currentPrice: 599, discountPercentage: 40 },
      affiliateUrl: "https://www.nykaa.com/",
      merchant: "nykaa",
      status: { isFeatured: true, isTrending: true, isActive: true },
    },
    {
      title: "Ultra Slim AMOLED Fitness Smart Watch",
      slug: "ultra-slim-amoled-smart-watch",
      shortDescription: "Heart rate monitor, SpO2 sensor, and 12-day battery life.",
      category: categories.get("electronics"),
      brand: "NovaTech",
      pricing: { originalPrice: 4999, currentPrice: 1999, discountPercentage: 60 },
      affiliateUrl: "https://www.flipkart.com/",
      merchant: "flipkart",
      status: { isFeatured: true, isTrending: true, isActive: true },
    },
    {
      title: "Insulated Double-Wall Stainless Steel Water Bottle 1L",
      slug: "stainless-steel-water-bottle-1l",
      shortDescription: "Keeps beverages cold for 24 hours and hot for 12 hours.",
      category: categories.get("home-garden"),
      brand: "HydroPeak",
      pricing: { originalPrice: 1499, currentPrice: 799, discountPercentage: 47 },
      affiliateUrl: "https://www.amazon.in/",
      merchant: "amazon",
      status: { isFeatured: true, isTrending: true, isActive: true },
    },
  ]

  for (const product of products) {
    const existing = await payload.find({ collection: "products", where: { slug: { equals: product.slug } }, limit: 1 })
    if (!existing.docs.length) {
      await payload.create({ collection: "products", data: product as any })
    }
  }

  const coupons = [
    {
      title: "Extra 10% Off on Laptops, Mobiles & Tech",
      description: "Valid across top brands on orders above ₹1,499. Apply coupon code at checkout.",
      merchant: "Amazon",
      code: "AMZTECH10",
      discount: "10% OFF",
      affiliateUrl: "https://www.amazon.in/",
      expiresAt: "2026-12-31T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Flat ₹500 Off on Latest Fashion Trends",
      description: "Valid on clothing, footwear and accessories on orders above ₹1,999.",
      merchant: "Myntra",
      code: "MYNTRA500",
      discount: "FLAT ₹500",
      affiliateUrl: "https://www.myntra.com/",
      expiresAt: "2026-11-30T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Flat 50% Off on Food Orders (Up to ₹120)",
      description: "Enjoy your favorite meals delivered fast. Valid on select restaurants.",
      merchant: "Swiggy",
      code: "SWIGGY50",
      discount: "50% OFF",
      affiliateUrl: "https://www.swiggy.com/",
      expiresAt: "2026-10-31T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Extra 25% Off on Men & Women Footwear",
      description: "Save big on sneakers, formal shoes and casual wear with no minimum order.",
      merchant: "Ajio",
      code: "AJIOSTEP25",
      discount: "25% OFF",
      affiliateUrl: "https://www.ajio.com/",
      expiresAt: "2026-12-15T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Flat 15% Off on Skincare, Makeup & Wellness",
      description: "Applicable on verified beauty brands with free delivery over ₹499.",
      merchant: "Nykaa",
      code: "NYKAAGLOW",
      discount: "15% OFF",
      affiliateUrl: "https://www.nykaa.com/",
      expiresAt: "2026-11-15T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Up to ₹2,500 Off on Domestic Flight Bookings",
      description: "Instant fare discount on domestic flight tickets across major airlines.",
      merchant: "MakeMyTrip",
      code: "MMTFLY",
      discount: "₹2,500 OFF",
      affiliateUrl: "https://www.makemytrip.com/",
      expiresAt: "2026-12-31T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
  ]

  for (const coupon of coupons) {
    const existing = await payload.find({ collection: "coupon-offers", where: { code: { equals: coupon.code } }, limit: 1 })
    if (!existing.docs.length) {
      await payload.create({ collection: "coupon-offers", data: coupon })
    }
  }

  const cashbacks = [
    {
      title: "Shop Fashion & Footwear with Extra Savings",
      description: "Activate before shopping and earn real cash back on all eligible orders.",
      merchant: "Myntra",
      cashbackRate: "Up to 8.5% Cashback",
      affiliateUrl: "https://www.myntra.com/",
      expiresAt: "2026-12-31T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Earn Cashback on Prime & Eligible Electronics",
      description: "Cashback tracks within 24 hours. Withdraw directly to your bank account.",
      merchant: "Amazon",
      cashbackRate: "Up to 5.0% Cashback",
      affiliateUrl: "https://www.amazon.in/",
      expiresAt: "2026-12-31T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Trending Streetwear & Ethnic Styles Rewards",
      description: "Flat cashback paid into your wallet on confirmed apparel purchases.",
      merchant: "Ajio",
      cashbackRate: "Flat ₹150 Cashback",
      affiliateUrl: "https://www.ajio.com/",
      expiresAt: "2026-11-30T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Beauty, Cosmetics & Personal Care Rewards",
      description: "Highest cashback guaranteed on top makeup, skincare and haircare.",
      merchant: "Nykaa",
      cashbackRate: "Up to 7.0% Cashback",
      affiliateUrl: "https://www.nykaa.com/",
      expiresAt: "2026-10-31T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Online Food Delivery & Instamart Cashback",
      description: "Earn flat cashback on every completed food delivery order.",
      merchant: "Swiggy",
      cashbackRate: "Flat ₹50 Cashback",
      affiliateUrl: "https://www.swiggy.com/",
      expiresAt: "2026-12-31T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
    {
      title: "Flight, Hotel & Holiday Package Bookings",
      description: "Save big on your next vacation with direct bank-transferable cashback.",
      merchant: "MakeMyTrip",
      cashbackRate: "Up to 6.5% Cashback",
      affiliateUrl: "https://www.makemytrip.com/",
      expiresAt: "2026-12-31T23:59:59.000Z",
      isVerified: true,
      isActive: true,
    },
  ]

  for (const cashback of cashbacks) {
    const existing = await payload.find({ collection: "cashback-offers", where: { title: { equals: cashback.title } }, limit: 1 })
    if (!existing.docs.length) {
      await payload.create({ collection: "cashback-offers", data: cashback })
    }
  }

  console.log("Enriched sample categories, deals, coupons, and cashback offers are ready.")
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

