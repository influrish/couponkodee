import dotenv from "dotenv"
import { getPayload } from "payload"
import { initialStores } from "../lib/stores-data"

dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env" })
const { default: config } = await import("../src/payload.config")

async function seedCompleteDatabase() {
  console.log("🌱 Starting full database synchronization with Payload CMS...")
  const payload = await getPayload({ config })

  // 1. Ensure Admin User Exists
  const adminEmail = "admin@couponkodee.com"
  const existingUsers = await payload.find({
    collection: "users",
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: adminEmail,
        password: "admin123",
        name: "Admin Manager",
        role: "admin",
      },
    })
    console.log("✅ Created default administrator: admin@couponkodee.com (password: admin123)")
  } else {
    console.log("ℹ️ Administrator account already exists: admin@couponkodee.com")
  }

  // 2. Seed Categories
  const categoryMap = new Map<string, string>()
  const categoriesToSeed = [
    { name: "Fashion & Apparel", slug: "fashion", description: "Designer clothing, footwear, ethnic wear, and daily apparel.", shortDescription: "Fashion & Clothing", icon: "shirt" as const, color: "purple" as const, isActive: true, isFeatured: true, level: 0, sortOrder: 1 },
    { name: "Mobiles & Electronics", slug: "electronics", description: "Smartphones, laptops, smart TVs, audio gear, and appliances.", shortDescription: "Gadgets & Tech", icon: "smartphone" as const, color: "blue" as const, isActive: true, isFeatured: true, level: 0, sortOrder: 2 },
    { name: "Food & Dining", slug: "food", description: "Online food delivery, pizzas, burgers, cafes, and gourmet dining.", shortDescription: "Food & Dining", icon: "activity" as const, color: "orange" as const, isActive: true, isFeatured: true, level: 0, sortOrder: 3 },
    { name: "Travel & Flights", slug: "travel", description: "Domestic & international flights, hotels, holidays, and cabs.", shortDescription: "Travel & Flights", icon: "bag" as const, color: "indigo" as const, isActive: true, isFeatured: true, level: 0, sortOrder: 4 },
    { name: "Beauty & Wellness", slug: "beauty", description: "Skincare, cosmetics, haircare, wellness, and pharmacies.", shortDescription: "Beauty & Health", icon: "heart" as const, color: "pink" as const, isActive: true, isFeatured: true, level: 0, sortOrder: 5 },
    { name: "Home & Living", slug: "home", description: "Furniture, home decor, cookware, and interior furnishings.", shortDescription: "Home & Kitchen", icon: "home" as const, color: "green" as const, isActive: true, isFeatured: true, level: 0, sortOrder: 6 },
    { name: "Grocery & Essentials", slug: "grocery", description: "Fresh produce, daily staples, and 10-minute grocery delivery.", shortDescription: "Grocery & Daily", icon: "camera" as const, color: "yellow" as const, isActive: true, isFeatured: true, level: 0, sortOrder: 7 },
  ]

  for (const cat of categoriesToSeed) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })
    const doc = existing.docs[0] || (await payload.create({ collection: "categories", data: cat }))
    categoryMap.set(cat.slug, String(doc.id))
  }
  console.log(`✅ Verified ${categoryMap.size} department categories in database.`)

  // 3. Seed All 31+ Stores into Payload
  const storeIdMap = new Map<string, string>()
  let storeCreatedCount = 0

  for (const store of initialStores) {
    const existing = await payload.find({
      collection: "stores",
      where: { slug: { equals: store.slug } },
      limit: 1,
    })

    const storeData = {
      name: store.name,
      slug: store.slug,
      category: store.category,
      categoryName: store.categoryName,
      description: store.description,
      initial: store.initial,
      bg: store.bg,
      affiliateUrl: store.affiliateUrl,
      cashbackRate: store.cashbackRate || null,
      cashbackTerms: store.cashbackTerms || `Earn cashback on all valid ${store.name} purchases.`,
      couponsCount: store.couponsCount,
      isPopular: store.isPopular,
      isFeatured: store.isPopular,
      hasCashback: store.hasCashback,
      hasCoupons: store.hasCoupons,
      isVerified: store.isVerified,
      isActive: true,
      sortOrder: store.isPopular ? 10 : 0,
    }

    if (existing.docs.length > 0) {
      storeIdMap.set(store.slug, String(existing.docs[0].id))
    } else {
      const created = await payload.create({
        collection: "stores",
        data: storeData as any,
      })
      storeIdMap.set(store.slug, String(created.id))
      storeCreatedCount++
    }
  }
  console.log(`✅ Loaded ${storeIdMap.size} stores into database (${storeCreatedCount} newly created).`)

  // 4. Seed All Verified Coupons
  let couponCount = 0
  for (const store of initialStores) {
    const offers = store.offers || []
    const couponOffers = offers.filter((o) => o.type === "coupon" || Boolean(o.code))

    for (const c of couponOffers) {
      const existing = await payload.find({
        collection: "coupon-offers",
        where: {
          and: [
            { merchant: { equals: store.name } },
            { code: { equals: c.code || "SAVE" } },
          ],
        },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: "coupon-offers",
          data: {
            title: c.title,
            description: c.description || `Use coupon code ${c.code} at ${store.name} checkout.`,
            store: storeIdMap.get(store.slug) || undefined,
            merchant: store.name,
            merchantSlug: store.slug,
            category: store.category,
            code: c.code || "SAVE",
            discount: c.discount,
            affiliateUrl: c.affiliateUrl || store.affiliateUrl,
            isVerified: c.isVerified,
            isFeatured: store.isPopular,
            isActive: true,
            sortOrder: store.isPopular ? 10 : 0,
          },
        })
        couponCount++
      }
    }
  }
  console.log(`✅ Synced ${couponCount} verified coupon codes into database.`)

  // 5. Seed Cashback Offers
  let cashbackCount = 0
  for (const store of initialStores) {
    if (store.hasCashback && store.cashbackRate) {
      const existing = await payload.find({
        collection: "cashback-offers",
        where: {
          and: [
            { merchant: { equals: store.name } },
          ],
        },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: "cashback-offers",
          data: {
            title: `Earn ${store.cashbackRate} on All Valid Orders`,
            description: store.cashbackTerms || `Activate cashback before shopping at ${store.name} to receive rewards.`,
            store: storeIdMap.get(store.slug) || undefined,
            merchant: store.name,
            merchantSlug: store.slug,
            category: store.category,
            cashbackRate: store.cashbackRate,
            cashbackTerms: store.cashbackTerms || "Cashback tracks within 24-72 hours. Available for bank withdrawal.",
            affiliateUrl: store.affiliateUrl,
            isVerified: true,
            isFeatured: store.isPopular,
            isActive: true,
            sortOrder: store.isPopular ? 10 : 0,
          },
        })
        cashbackCount++
      }
    }
  }
  console.log(`✅ Synced ${cashbackCount} cashback offers into database.`)

  // 6. Seed Deals / Products
  let dealsCount = 0
  for (const store of initialStores) {
    const deals = (store.offers || []).filter((o) => o.type === "deal")
    for (const deal of deals) {
      const dealSlug = `${store.slug}-${deal.id.replace(/[^a-z0-9]/g, "-")}`
      const existing = await payload.find({
        collection: "products",
        where: { slug: { equals: dealSlug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        const discountMatch = deal.discount.match(/(\d+)%/)
        const discountPct = discountMatch ? parseInt(discountMatch[1], 10) : 40
        const originalPrice = 2999
        const currentPrice = Math.round(originalPrice * (1 - discountPct / 100))

        await payload.create({
          collection: "products",
          data: {
            title: `${deal.title} (${store.name})`,
            slug: dealSlug,
            shortDescription: deal.description || `Exclusive deal offering ${deal.discount} at ${store.name}.`,
            category: categoryMap.get(store.category) || categoryMap.get("electronics"),
            store: storeIdMap.get(store.slug) || undefined,
            brand: store.name,
            merchant: store.slug as any,
            pricing: {
              originalPrice,
              currentPrice,
              discountPercentage: discountPct,
            },
            affiliateUrl: deal.affiliateUrl || store.affiliateUrl,
            status: {
              isFeatured: store.isPopular,
              isTrending: true,
              isVerified: true,
              isActive: true,
            },
          } as any,
        })
        dealsCount++
      }
    }
  }
  console.log(`✅ Synced ${dealsCount} deals into database.`)

  console.log("\n🎉 Full database synchronization completed successfully!")
  process.exit(0)
}

seedCompleteDatabase().catch((err) => {
  console.error("❌ Seeding error:", err)
  process.exit(1)
})
