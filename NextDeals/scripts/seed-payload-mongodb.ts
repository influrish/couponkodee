import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the correct location
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);

dotenv.config({ path: envPath });

// Verify the variables loaded
console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET);
console.log('MONGODB_URI:', process.env.DATABASE_URI);

import { getPayload } from 'payload';

import config from '../src/payload.config'

const seed = async () => {
  try {
    console.log("🚀 Seeding Payload CMS with MongoDB...")
    const payload = await getPayload({ config })
    console.log("Payload initialized successfully")
    await seedData(payload)
  } catch (error) {
    console.error("❌ Initialization failed:", error)
    process.exit(1)
  }
}

async function seedData(payload: any) {
 

  // Create admin user
  const adminUser = await payload.create({
    collection: "users",
    data: {
      email: "admin@couponkodee.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    },
  })

  console.log("✅ Created admin user:", adminUser.email)

  // Create main categories with MongoDB optimizations
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
      viewCount: 15420,
      lastViewedAt: new Date(),
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
      viewCount: 12890,
      lastViewedAt: new Date(),
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
      viewCount: 18750,
      lastViewedAt: new Date(),
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
      viewCount: 9340,
      lastViewedAt: new Date(),
    },
    {
      name: "Sports & Outdoors",
      slug: "sports-outdoors",
      description: "Fitness equipment, outdoor gear, and sporting goods",
      shortDescription: "Sports & Fitness",
      icon: "dumbbell",
      color: "orange",
      isActive: true,
      isFeatured: true,
      level: 0,
      sortOrder: 5,
      viewCount: 7650,
      lastViewedAt: new Date(),
    },
    {
      name: "Books & Media",
      slug: "books-media",
      description: "Books, movies, music, and educational content",
      shortDescription: "Books & Entertainment",
      icon: "book",
      color: "indigo",
      isActive: true,
      isFeatured: false,
      level: 0,
      sortOrder: 6,
      viewCount: 4320,
      lastViewedAt: new Date(),
    },
  ]

  const createdMainCategories = []
  for (const category of mainCategories) {
    const created = await payload.create({
      collection: "categories",
      data: category,
    })
    createdMainCategories.push(created)
    console.log("✅ Created main category:", created.name)
  }

  // Create subcategories with high traffic data
  const subcategories = [
    // Electronics subcategories
    {
      name: "Smartphones",
      slug: "smartphones",
      description: "Latest smartphones and mobile devices from top brands",
      shortDescription: "Mobile phones & accessories",
      icon: "smartphone",
      color: "blue",
      parent: createdMainCategories[0].id,
      level: 1,
      sortOrder: 1,
      isActive: true,
      viewCount: 8920,
      lastViewedAt: new Date(),
    },
    {
      name: "Laptops",
      slug: "laptops",
      description: "Gaming, business, and personal laptops for every need",
      shortDescription: "Computers & laptops",
      icon: "laptop",
      color: "blue",
      parent: createdMainCategories[0].id,
      level: 1,
      sortOrder: 2,
      isActive: true,
      viewCount: 6750,
      lastViewedAt: new Date(),
    },
    {
      name: "Headphones",
      slug: "headphones",
      description: "Wireless, wired, and gaming headphones with premium sound",
      shortDescription: "Audio & headphones",
      icon: "headphones",
      color: "blue",
      parent: createdMainCategories[0].id,
      level: 1,
      sortOrder: 3,
      isActive: true,
      viewCount: 5430,
      lastViewedAt: new Date(),
    },
    {
      name: "Smart Watches",
      slug: "smart-watches",
      description: "Fitness trackers and smartwatches for active lifestyles",
      shortDescription: "Wearable technology",
      icon: "watch",
      color: "blue",
      parent: createdMainCategories[0].id,
      level: 1,
      sortOrder: 4,
      isActive: true,
      viewCount: 4210,
      lastViewedAt: new Date(),
    },

    // Home & Garden subcategories
    {
      name: "Furniture",
      slug: "furniture",
      description: "Living room, bedroom, and office furniture for modern homes",
      shortDescription: "Home furniture",
      icon: "sofa",
      color: "green",
      parent: createdMainCategories[1].id,
      level: 1,
      sortOrder: 1,
      isActive: true,
      viewCount: 7890,
      lastViewedAt: new Date(),
    },
    {
      name: "Kitchen Appliances",
      slug: "kitchen-appliances",
      description: "Kitchen appliances and cookware for culinary enthusiasts",
      shortDescription: "Kitchen essentials",
      icon: "kitchen",
      color: "green",
      parent: createdMainCategories[1].id,
      level: 1,
      sortOrder: 2,
      isActive: true,
      viewCount: 6540,
      lastViewedAt: new Date(),
    },
    {
      name: "Garden & Outdoor",
      slug: "garden-outdoor",
      description: "Gardening tools and outdoor equipment for green thumbs",
      shortDescription: "Garden & outdoor",
      icon: "garden",
      color: "green",
      parent: createdMainCategories[1].id,
      level: 1,
      sortOrder: 3,
      isActive: true,
      viewCount: 3210,
      lastViewedAt: new Date(),
    },

    // Fashion subcategories
    {
      name: "Men's Clothing",
      slug: "mens-clothing",
      description: "Trendy men's fashion and apparel",
      shortDescription: "Men's fashion",
      icon: "shirt",
      color: "purple",
      parent: createdMainCategories[2].id,
      level: 1,
      sortOrder: 1,
      isActive: true,
      viewCount: 9870,
      lastViewedAt: new Date(),
    },
    {
      name: "Women's Clothing",
      slug: "womens-clothing",
      description: "Stylish women's fashion and accessories",
      shortDescription: "Women's fashion",
      icon: "shirt",
      color: "purple",
      parent: createdMainCategories[2].id,
      level: 1,
      sortOrder: 2,
      isActive: true,
      viewCount: 12340,
      lastViewedAt: new Date(),
    },
    {
      name: "Shoes",
      slug: "shoes",
      description: "Sneakers, boots, and formal shoes for every occasion",
      shortDescription: "Footwear",
      icon: "shoes",
      color: "purple",
      parent: createdMainCategories[2].id,
      level: 1,
      sortOrder: 3,
      isActive: true,
      viewCount: 8760,
      lastViewedAt: new Date(),
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Bags, jewelry, and fashion accessories",
      shortDescription: "Fashion accessories",
      icon: "bag",
      color: "purple",
      parent: createdMainCategories[2].id,
      level: 1,
      sortOrder: 4,
      isActive: true,
      viewCount: 5670,
      lastViewedAt: new Date(),
    },

    // Health & Beauty subcategories
    {
      name: "Skincare",
      slug: "skincare",
      description: "Face care, moisturizers, and anti-aging treatments",
      shortDescription: "Skin treatments",
      icon: "sparkles",
      color: "pink",
      parent: createdMainCategories[3].id,
      level: 1,
      sortOrder: 1,
      isActive: true,
      viewCount: 6890,
      lastViewedAt: new Date(),
    },
    {
      name: "Makeup",
      slug: "makeup",
      description: "Cosmetics and beauty products from top brands",
      shortDescription: "Beauty & cosmetics",
      icon: "sparkles",
      color: "pink",
      parent: createdMainCategories[3].id,
      level: 1,
      sortOrder: 2,
      isActive: true,
      viewCount: 8450,
      lastViewedAt: new Date(),
    },
    {
      name: "Health Supplements",
      slug: "health-supplements",
      description: "Vitamins, supplements, and wellness products",
      shortDescription: "Health & wellness",
      icon: "heart",
      color: "pink",
      parent: createdMainCategories[3].id,
      level: 1,
      sortOrder: 3,
      isActive: true,
      viewCount: 4320,
      lastViewedAt: new Date(),
    },
  ]

  const createdSubcategories = []
  for (const subcategory of subcategories) {
    const created = await payload.create({
      collection: "categories",
      data: subcategory,
    })
    createdSubcategories.push(created)
    console.log("✅ Created subcategory:", created.name)
  }

  // Create sample products with high traffic analytics
  const sampleProducts = [
    {
      title: "Apple MacBook Air M2 13-inch - Space Gray",
      slug: "apple-macbook-air-m2-13-space-gray",
      description:
        "The new MacBook Air with M2 chip delivers incredible performance and battery life in an ultra-thin design. Perfect for professionals and students.",
      shortDescription: "Powerful M2 chip, 13-inch display, all-day battery life",
      category: createdSubcategories.find((c) => c.slug === "laptops").id,
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
      affiliateUrl: "https://amazon.com/dp/macbook-air-m2",
      merchant: "amazon",
      status: {
        isFeatured: true,
        isTrending: true,
        isActive: true,
      },
      features: [
        { name: "Processor", value: "Apple M2 chip with 8-core CPU" },
        { name: "Memory", value: "8GB unified memory" },
        { name: "Storage", value: "256GB SSD" },
        { name: "Display", value: "13.6-inch Liquid Retina display" },
        { name: "Battery Life", value: "Up to 18 hours" },
      ],
      analytics: {
        viewCount: 15420,
        clickCount: 1234,
        conversionRate: 8.01,
        lastViewedAt: new Date(),
      },
    },
    {
      title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      slug: "sony-wh-1000xm5-wireless-headphones",
      description:
        "Industry-leading noise canceling with premium sound quality and comfort. Perfect for travel and daily use.",
      shortDescription: "Premium noise canceling, 30-hour battery, crystal clear calls",
      category: createdSubcategories.find((c) => c.slug === "headphones").id,
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
      affiliateUrl: "https://amazon.com/dp/sony-wh1000xm5",
      merchant: "amazon",
      status: {
        isFeatured: true,
        isTrending: false,
        isActive: true,
      },
      features: [
        { name: "Noise Canceling", value: "Industry-leading noise canceling" },
        { name: "Battery Life", value: "Up to 30 hours" },
        { name: "Connectivity", value: "Bluetooth 5.2, NFC" },
        { name: "Weight", value: "250g" },
      ],
      analytics: {
        viewCount: 8920,
        clickCount: 756,
        conversionRate: 8.47,
        lastViewedAt: new Date(),
      },
    },
    {
      title: "iPhone 15 Pro Max - Natural Titanium 256GB",
      slug: "iphone-15-pro-max-natural-titanium-256gb",
      description:
        "The ultimate iPhone with titanium design and advanced camera system. Features the powerful A17 Pro chip.",
      shortDescription: "Titanium build, A17 Pro chip, advanced camera system",
      category: createdSubcategories.find((c) => c.slug === "smartphones").id,
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
      affiliateUrl: "https://amazon.com/dp/iphone-15-pro-max",
      merchant: "amazon",
      status: {
        isFeatured: false,
        isTrending: true,
        isActive: true,
      },
      features: [
        { name: "Display", value: "6.7-inch Super Retina XDR" },
        { name: "Chip", value: "A17 Pro chip" },
        { name: "Camera", value: "48MP Main camera" },
        { name: "Storage", value: "256GB" },
      ],
      analytics: {
        viewCount: 12340,
        clickCount: 987,
        conversionRate: 7.99,
        lastViewedAt: new Date(),
      },
    },
    {
      title: "Nike Air Max 270 Sneakers - Black/White",
      slug: "nike-air-max-270-sneakers-black-white",
      description:
        "Comfortable lifestyle sneakers with Max Air cushioning. Perfect for everyday wear and light workouts.",
      shortDescription: "Max Air cushioning, breathable mesh, iconic design",
      category: createdSubcategories.find((c) => c.slug === "shoes").id,
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
      affiliateUrl: "https://amazon.com/dp/nike-air-max-270",
      merchant: "amazon",
      status: {
        isFeatured: true,
        isTrending: true,
        isActive: true,
      },
      features: [
        { name: "Cushioning", value: "Max Air unit in heel" },
        { name: "Upper", value: "Breathable mesh and synthetic" },
        { name: "Sole", value: "Rubber outsole" },
        { name: "Fit", value: "True to size" },
      ],
      analytics: {
        viewCount: 6750,
        clickCount: 543,
        conversionRate: 8.04,
        lastViewedAt: new Date(),
      },
    },
    {
      title: "Dyson V15 Detect Cordless Vacuum Cleaner",
      slug: "dyson-v15-detect-cordless-vacuum",
      description:
        "Advanced laser technology reveals microscopic dust for a deep clean. The most powerful Dyson cordless vacuum.",
      shortDescription: "Laser dust detection, powerful suction, 60-minute runtime",
      category: createdMainCategories[1].id, // Home & Garden main category
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
      affiliateUrl: "https://amazon.com/dp/dyson-v15-detect",
      merchant: "amazon",
      status: {
        isFeatured: true,
        isTrending: false,
        isActive: true,
      },
      features: [
        { name: "Suction Power", value: "230 Air Watts" },
        { name: "Runtime", value: "Up to 60 minutes" },
        { name: "Bin Capacity", value: "0.77 liters" },
        { name: "Weight", value: "3.0 kg" },
      ],
      analytics: {
        viewCount: 4320,
        clickCount: 345,
        conversionRate: 7.99,
        lastViewedAt: new Date(),
      },
    },
    {
      title: "The Ordinary Niacinamide 10% + Zinc 1% Serum",
      slug: "the-ordinary-niacinamide-zinc-serum",
      description: "High-strength vitamin and mineral blemish formula. Reduces appearance of blemishes and congestion.",
      shortDescription: "Reduces blemishes, controls oil, improves skin texture",
      category: createdSubcategories.find((c) => c.slug === "skincare").id,
      brand: "The Ordinary",
      model: "Niacinamide 10% + Zinc 1%",
      sku: "TO-NIACINAMIDE-30ML",
      pricing: {
        originalPrice: 7.0,
        currentPrice: 6.0,
        discountPercentage: 14,
      },
      rating: 4.4,
      reviewCount: 12847,
      affiliateUrl: "https://amazon.com/dp/the-ordinary-niacinamide",
      merchant: "amazon",
      status: {
        isFeatured: false,
        isTrending: true,
        isActive: true,
      },
      features: [
        { name: "Active Ingredient", value: "10% Niacinamide, 1% Zinc" },
        { name: "Size", value: "30ml" },
        { name: "Skin Type", value: "All skin types" },
        { name: "Usage", value: "AM/PM after cleansing" },
      ],
      analytics: {
        viewCount: 9870,
        clickCount: 789,
        conversionRate: 7.99,
        lastViewedAt: new Date(),
      },
    },
  ]

  for (const product of sampleProducts) {
    const created = await payload.create({
      collection: "products",
      data: product,
    })
    console.log("✅ Created product:", created.title)

    // Create price history for each product
    const priceHistoryEntries = [
      {
        product: created.id,
        price: product.pricing.originalPrice,
        source: "manual",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      {
        product: created.id,
        price: product.pricing.originalPrice * 0.95,
        source: "scheduled",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
      {
        product: created.id,
        price: product.pricing.currentPrice,
        source: "scheduled",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    ]

    for (const entry of priceHistoryEntries) {
      await payload.create({
        collection: "price-history",
        data: entry,
      })
    }
  }

  // Create sample newsletter subscribers
  const sampleSubscribers = [
    {
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      isActive: true,
      preferences: {
        categories: [createdMainCategories[0].id, createdMainCategories[2].id],
        frequency: "weekly",
      },
      source: "website",
    },
    {
      email: "jane.smith@example.com",
      firstName: "Jane",
      lastName: "Smith",
      isActive: true,
      preferences: {
        categories: [createdMainCategories[1].id, createdMainCategories[3].id],
        frequency: "daily",
      },
      source: "social",
    },
  ]

  for (const subscriber of sampleSubscribers) {
    await payload.create({
      collection: "newsletter-subscribers",
      data: subscriber,
    })
    console.log("✅ Created newsletter subscriber:", subscriber.email)
  }

  console.log("🎉 MongoDB seeding completed successfully!")
  console.log("📊 Created:")
  console.log(`   - ${createdMainCategories.length} main categories`)
  console.log(`   - ${createdSubcategories.length} subcategories`)
  console.log(`   - ${sampleProducts.length} products with analytics`)
  console.log(`   - ${sampleProducts.length * 3} price history entries`)
  console.log(`   - ${sampleSubscribers.length} newsletter subscribers`)
  console.log("🚀 Ready for high traffic!")

  process.exit(0)
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error)
  process.exit(1)
})
