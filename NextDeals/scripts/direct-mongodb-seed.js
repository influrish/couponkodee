import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const DATABASE_URI = process.env.DATABASE_URI || "mongodb://localhost:27017/dealscope"

async function seedMongoDB() {
  console.log("🚀 Seeding MongoDB directly...")

  const client = new MongoClient(DATABASE_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db()

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await db.collection("users").deleteMany({})
    await db.collection("categories").deleteMany({})
    await db.collection("products").deleteMany({})
    await db.collection("pricehistories").deleteMany({})
    await db.collection("newslettersubscribers").deleteMany({})

    // Create admin user
    console.log("👤 Creating admin user...")
    const adminUser = {
      email: "admin@couponkodee.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: admin123
      name: "Admin User",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const userResult = await db.collection("users").insertOne(adminUser)
    console.log("✅ Created admin user:", adminUser.email)

    // Create main categories
    console.log("📂 Creating categories...")
    const mainCategories = [
      {
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets, smartphones, laptops, and tech accessories",
        shortDescription: "Gadgets & Tech",
        icon: "smartphone",
        color: "blue",
        isActive: true,
        isFeatured: true,
        level: 0,
        sortOrder: 1,
        productCount: 0,
        subcategoryCount: 0,
        viewCount: 15420,
        lastViewedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Home & Garden",
        slug: "home-garden",
        description: "Everything for your home, from furniture to gardening tools",
        shortDescription: "Home & Living",
        icon: "home",
        color: "green",
        isActive: true,
        isFeatured: true,
        level: 0,
        sortOrder: 2,
        productCount: 0,
        subcategoryCount: 0,
        viewCount: 12890,
        lastViewedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Fashion",
        slug: "fashion",
        description: "Trending clothing, shoes, and accessories for all styles",
        shortDescription: "Style & Fashion",
        icon: "shirt",
        color: "purple",
        isActive: true,
        isFeatured: true,
        level: 0,
        sortOrder: 3,
        productCount: 0,
        subcategoryCount: 0,
        viewCount: 18750,
        lastViewedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Health & Beauty",
        slug: "health-beauty",
        description: "Skincare, wellness products, and beauty essentials",
        shortDescription: "Health & Wellness",
        icon: "heart",
        color: "pink",
        isActive: true,
        isFeatured: true,
        level: 0,
        sortOrder: 4,
        productCount: 0,
        subcategoryCount: 0,
        viewCount: 9340,
        lastViewedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const categoryResult = await db.collection("categories").insertMany(mainCategories)
    const categoryIds = Object.values(categoryResult.insertedIds)
    console.log("✅ Created main categories:", mainCategories.length)

    // Create subcategories
    const subcategories = [
      {
        name: "Smartphones",
        slug: "smartphones",
        description: "Latest smartphones and mobile devices from top brands",
        shortDescription: "Mobile phones & accessories",
        icon: "smartphone",
        color: "blue",
        parent: categoryIds[0], // Electronics
        level: 1,
        sortOrder: 1,
        isActive: true,
        productCount: 0,
        subcategoryCount: 0,
        viewCount: 8920,
        lastViewedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Laptops",
        slug: "laptops",
        description: "Gaming, business, and personal laptops for every need",
        shortDescription: "Computers & laptops",
        icon: "laptop",
        color: "blue",
        parent: categoryIds[0], // Electronics
        level: 1,
        sortOrder: 2,
        isActive: true,
        productCount: 0,
        subcategoryCount: 0,
        viewCount: 6750,
        lastViewedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Headphones",
        slug: "headphones",
        description: "Wireless, wired, and gaming headphones with premium sound",
        shortDescription: "Audio & headphones",
        icon: "headphones",
        color: "blue",
        parent: categoryIds[0], // Electronics
        level: 1,
        sortOrder: 3,
        isActive: true,
        productCount: 0,
        subcategoryCount: 0,
        viewCount: 5430,
        lastViewedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Shoes",
        slug: "shoes",
        description: "Sneakers, boots, and formal shoes for every occasion",
        shortDescription: "Footwear",
        icon: "shoes",
        color: "purple",
        parent: categoryIds[2], // Fashion
        level: 1,
        sortOrder: 1,
        isActive: true,
        productCount: 0,
        subcategoryCount: 0,
        viewCount: 8760,
        lastViewedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const subcategoryResult = await db.collection("categories").insertMany(subcategories)
    const subcategoryIds = Object.values(subcategoryResult.insertedIds)
    console.log("✅ Created subcategories:", subcategories.length)

    // Create sample products
    console.log("🛍️ Creating products...")
    const sampleProducts = [
      {
        title: "Apple MacBook Air M2 13-inch - Space Gray",
        slug: "apple-macbook-air-m2-13-space-gray",
        description:
          "The new MacBook Air with M2 chip delivers incredible performance and battery life in an ultra-thin design. Perfect for professionals and students.",
        shortDescription: "Powerful M2 chip, 13-inch display, all-day battery life",
        category: subcategoryIds[1], // Laptops
        brand: "Apple",
        model: "MacBook Air M2",
        sku: "MBA-M2-13-SG-256",
        pricing: {
          originalPrice: 1199.0,
          currentPrice: 999.0,
          discountPercentage: 17,
        },
        rating: 4.8,
        reviewCount: 2847,
        images: [],
        affiliateUrl: "https://amazon.com/dp/macbook-air-m2",
        merchant: "amazon",
        features: [
          { name: "Processor", value: "Apple M2 chip with 8-core CPU" },
          { name: "Memory", value: "8GB unified memory" },
          { name: "Storage", value: "256GB SSD" },
          { name: "Display", value: "13.6-inch Liquid Retina display" },
          { name: "Battery Life", value: "Up to 18 hours" },
        ],
        status: {
          isFeatured: true,
          isTrending: true,
          isActive: true,
        },
        analytics: {
          viewCount: 15420,
          clickCount: 1234,
          conversionRate: 8.01,
          lastViewedAt: new Date(),
        },
        seo: {
          title: "Apple MacBook Air M2 13-inch - Best Price & Reviews",
          description:
            "Get the best deal on Apple MacBook Air M2 13-inch. Compare prices, read reviews, and find the lowest price.",
          keywords: "MacBook Air M2, Apple laptop, best price, deals",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        slug: "sony-wh-1000xm5-wireless-headphones",
        description:
          "Industry-leading noise canceling with premium sound quality and comfort. Perfect for travel and daily use.",
        shortDescription: "Premium noise canceling, 30-hour battery, crystal clear calls",
        category: subcategoryIds[2], // Headphones
        brand: "Sony",
        model: "WH-1000XM5",
        sku: "SONY-WH1000XM5-B",
        pricing: {
          originalPrice: 399.0,
          currentPrice: 299.0,
          discountPercentage: 25,
        },
        rating: 4.9,
        reviewCount: 1523,
        images: [],
        affiliateUrl: "https://amazon.com/dp/sony-wh1000xm5",
        merchant: "amazon",
        features: [
          { name: "Noise Canceling", value: "Industry-leading noise canceling" },
          { name: "Battery Life", value: "Up to 30 hours" },
          { name: "Connectivity", value: "Bluetooth 5.2, NFC" },
          { name: "Weight", value: "250g" },
        ],
        status: {
          isFeatured: true,
          isTrending: false,
          isActive: true,
        },
        analytics: {
          viewCount: 8920,
          clickCount: 756,
          conversionRate: 8.47,
          lastViewedAt: new Date(),
        },
        seo: {
          title: "Sony WH-1000XM5 Headphones - Best Price & Reviews",
          description: "Find the best deal on Sony WH-1000XM5 wireless headphones. Premium noise canceling technology.",
          keywords: "Sony headphones, noise canceling, wireless, best price",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "iPhone 15 Pro Max - Natural Titanium 256GB",
        slug: "iphone-15-pro-max-natural-titanium-256gb",
        description:
          "The ultimate iPhone with titanium design and advanced camera system. Features the powerful A17 Pro chip.",
        shortDescription: "Titanium build, A17 Pro chip, advanced camera system",
        category: subcategoryIds[0], // Smartphones
        brand: "Apple",
        model: "iPhone 15 Pro Max",
        sku: "IPHONE-15-PM-NT-256",
        pricing: {
          originalPrice: 1199.0,
          currentPrice: 1199.0,
          discountPercentage: 0,
        },
        rating: 4.9,
        reviewCount: 5234,
        images: [],
        affiliateUrl: "https://amazon.com/dp/iphone-15-pro-max",
        merchant: "amazon",
        features: [
          { name: "Display", value: "6.7-inch Super Retina XDR" },
          { name: "Chip", value: "A17 Pro chip" },
          { name: "Camera", value: "48MP Main camera" },
          { name: "Storage", value: "256GB" },
        ],
        status: {
          isFeatured: false,
          isTrending: true,
          isActive: true,
        },
        analytics: {
          viewCount: 12340,
          clickCount: 987,
          conversionRate: 7.99,
          lastViewedAt: new Date(),
        },
        seo: {
          title: "iPhone 15 Pro Max - Best Price & Reviews",
          description: "Get the best deal on iPhone 15 Pro Max. Compare prices and find the lowest price available.",
          keywords: "iPhone 15 Pro Max, Apple phone, best price, deals",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Nike Air Max 270 Sneakers - Black/White",
        slug: "nike-air-max-270-sneakers-black-white",
        description:
          "Comfortable lifestyle sneakers with Max Air cushioning. Perfect for everyday wear and light workouts.",
        shortDescription: "Max Air cushioning, breathable mesh, iconic design",
        category: subcategoryIds[3], // Shoes
        brand: "Nike",
        model: "Air Max 270",
        sku: "NIKE-AM270-BW-10",
        pricing: {
          originalPrice: 150.0,
          currentPrice: 120.0,
          discountPercentage: 20,
        },
        rating: 4.6,
        reviewCount: 3421,
        images: [],
        affiliateUrl: "https://amazon.com/dp/nike-air-max-270",
        merchant: "amazon",
        features: [
          { name: "Cushioning", value: "Max Air unit in heel" },
          { name: "Upper", value: "Breathable mesh and synthetic" },
          { name: "Sole", value: "Rubber outsole" },
          { name: "Fit", value: "True to size" },
        ],
        status: {
          isFeatured: true,
          isTrending: true,
          isActive: true,
        },
        analytics: {
          viewCount: 6750,
          clickCount: 543,
          conversionRate: 8.04,
          lastViewedAt: new Date(),
        },
        seo: {
          title: "Nike Air Max 270 Sneakers - Best Price & Reviews",
          description: "Find the best deal on Nike Air Max 270 sneakers. Comfortable and stylish for everyday wear.",
          keywords: "Nike Air Max 270, sneakers, shoes, best price",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Dyson V15 Detect Cordless Vacuum Cleaner",
        slug: "dyson-v15-detect-cordless-vacuum",
        description:
          "Advanced laser technology reveals microscopic dust for a deep clean. The most powerful Dyson cordless vacuum.",
        shortDescription: "Laser dust detection, powerful suction, 60-minute runtime",
        category: categoryIds[1], // Home & Garden
        brand: "Dyson",
        model: "V15 Detect",
        sku: "DYSON-V15-DETECT-GOLD",
        pricing: {
          originalPrice: 749.0,
          currentPrice: 599.0,
          discountPercentage: 20,
        },
        rating: 4.7,
        reviewCount: 892,
        images: [],
        affiliateUrl: "https://amazon.com/dp/dyson-v15-detect",
        merchant: "amazon",
        features: [
          { name: "Suction Power", value: "230 Air Watts" },
          { name: "Runtime", value: "Up to 60 minutes" },
          { name: "Bin Capacity", value: "0.77 liters" },
          { name: "Weight", value: "3.0 kg" },
        ],
        status: {
          isFeatured: true,
          isTrending: false,
          isActive: true,
        },
        analytics: {
          viewCount: 4320,
          clickCount: 345,
          conversionRate: 7.99,
          lastViewedAt: new Date(),
        },
        seo: {
          title: "Dyson V15 Detect Vacuum - Best Price & Reviews",
          description:
            "Get the best deal on Dyson V15 Detect cordless vacuum. Advanced laser dust detection technology.",
          keywords: "Dyson V15, cordless vacuum, laser detection, best price",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const productResult = await db.collection("products").insertMany(sampleProducts)
    const productIds = Object.values(productResult.insertedIds)
    console.log("✅ Created products:", sampleProducts.length)

    // Create price history for products
    console.log("📈 Creating price history...")
    const priceHistoryEntries = []

    productIds.forEach((productId, index) => {
      const product = sampleProducts[index]

      // Create 3 price history entries for each product
      priceHistoryEntries.push(
        {
          product: productId,
          price: product.pricing.originalPrice,
          source: "manual",
          priceChange: 0,
          priceChangePercentage: 0,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          product: productId,
          price: product.pricing.originalPrice * 0.95,
          source: "scheduled",
          priceChange: product.pricing.originalPrice * -0.05,
          priceChangePercentage: -5,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
        {
          product: productId,
          price: product.pricing.currentPrice,
          source: "scheduled",
          priceChange: product.pricing.currentPrice - product.pricing.originalPrice * 0.95,
          priceChangePercentage:
            ((product.pricing.currentPrice - product.pricing.originalPrice * 0.95) /
              (product.pricing.originalPrice * 0.95)) *
            100,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      )
    })

    await db.collection("pricehistories").insertMany(priceHistoryEntries)
    console.log("✅ Created price history entries:", priceHistoryEntries.length)

    // Create newsletter subscribers
    console.log("📧 Creating newsletter subscribers...")
    const newsletterSubscribers = [
      {
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        isActive: true,
        preferences: {
          categories: [categoryIds[0], categoryIds[2]], // Electronics, Fashion
          frequency: "weekly",
        },
        source: "website",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "jane.smith@example.com",
        firstName: "Jane",
        lastName: "Smith",
        isActive: true,
        preferences: {
          categories: [categoryIds[1], categoryIds[3]], // Home & Garden, Health & Beauty
          frequency: "daily",
        },
        source: "social",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "mike.johnson@example.com",
        firstName: "Mike",
        lastName: "Johnson",
        isActive: true,
        preferences: {
          categories: [categoryIds[0]], // Electronics
          frequency: "monthly",
        },
        source: "referral",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("newslettersubscribers").insertMany(newsletterSubscribers)
    console.log("✅ Created newsletter subscribers:", newsletterSubscribers.length)

    // Update category product counts
    console.log("🔢 Updating category product counts...")
    for (let i = 0; i < categoryIds.length; i++) {
      const categoryId = categoryIds[i]
      const productCount = await db.collection("products").countDocuments({ category: categoryId })
      await db.collection("categories").updateOne({ _id: categoryId }, { $set: { productCount: productCount } })
    }

    for (let i = 0; i < subcategoryIds.length; i++) {
      const subcategoryId = subcategoryIds[i]
      const productCount = await db.collection("products").countDocuments({ category: subcategoryId })
      await db.collection("categories").updateOne({ _id: subcategoryId }, { $set: { productCount: productCount } })
    }

    // Update parent category subcategory counts
    await db.collection("categories").updateOne(
      { _id: categoryIds[0] }, // Electronics
      { $set: { subcategoryCount: 3 } },
    )
    await db.collection("categories").updateOne(
      { _id: categoryIds[2] }, // Fashion
      { $set: { subcategoryCount: 1 } },
    )

    console.log("🎉 MongoDB seeding completed successfully!")
    console.log("📊 Summary:")
    console.log(`   - 1 admin user created`)
    console.log(`   - ${mainCategories.length} main categories`)
    console.log(`   - ${subcategories.length} subcategories`)
    console.log(`   - ${sampleProducts.length} products`)
    console.log(`   - ${priceHistoryEntries.length} price history entries`)
    console.log(`   - ${newsletterSubscribers.length} newsletter subscribers`)
    console.log("")
    console.log("🚀 Ready to start your affiliate site!")
    console.log("📝 Next steps:")
    console.log("   1. Run: npm run dev")
    console.log("   2. Visit: http://localhost:3000")
    console.log("   3. Admin: http://localhost:3000/admin")
    console.log("   4. Create or sign in through the Payload admin panel")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seedMongoDB()
