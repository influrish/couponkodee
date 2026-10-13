import dotenv from "dotenv"
dotenv.config()

import payload from "payload"

const seed = async () => {
  console.log("Seeding Payload CMS with subcategories...")

  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    local: true,
  })

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

  console.log("Created admin user:", adminUser.email)

  // Create main categories
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
    },
  ]

  const createdMainCategories = []
  for (const category of mainCategories) {
    const created = await payload.create({
      collection: "categories",
      data: category,
    })
    createdMainCategories.push(created)
    console.log("Created main category:", created.name)
  }

  // Create subcategories
  const subcategories = [
    // Electronics subcategories
    {
      name: "Smartphones",
      slug: "smartphones",
      description: "Latest smartphones and mobile devices",
      shortDescription: "Mobile phones & accessories",
      icon: "smartphone",
      color: "blue",
      parent: createdMainCategories[0].id,
      level: 1,
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Laptops",
      slug: "laptops",
      description: "Gaming, business, and personal laptops",
      shortDescription: "Computers & laptops",
      icon: "laptop",
      color: "blue",
      parent: createdMainCategories[0].id,
      level: 1,
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Headphones",
      slug: "headphones",
      description: "Wireless, wired, and gaming headphones",
      shortDescription: "Audio & headphones",
      icon: "headphones",
      color: "blue",
      parent: createdMainCategories[0].id,
      level: 1,
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Cameras",
      slug: "cameras",
      description: "Digital cameras and photography equipment",
      shortDescription: "Photography gear",
      icon: "camera",
      color: "blue",
      parent: createdMainCategories[0].id,
      level: 1,
      sortOrder: 4,
      isActive: true,
    },

    // Home & Garden subcategories
    {
      name: "Furniture",
      slug: "furniture",
      description: "Living room, bedroom, and office furniture",
      shortDescription: "Home furniture",
      icon: "sofa",
      color: "green",
      parent: createdMainCategories[1].id,
      level: 1,
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Kitchen",
      slug: "kitchen",
      description: "Kitchen appliances and cookware",
      shortDescription: "Kitchen essentials",
      icon: "kitchen",
      color: "green",
      parent: createdMainCategories[1].id,
      level: 1,
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Garden",
      slug: "garden",
      description: "Gardening tools and outdoor equipment",
      shortDescription: "Garden & outdoor",
      icon: "garden",
      color: "green",
      parent: createdMainCategories[1].id,
      level: 1,
      sortOrder: 3,
      isActive: true,
    },

    // Fashion subcategories
    {
      name: "Clothing",
      slug: "clothing",
      description: "Men's and women's clothing",
      shortDescription: "Apparel & clothing",
      icon: "shirt",
      color: "purple",
      parent: createdMainCategories[2].id,
      level: 1,
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Shoes",
      slug: "shoes",
      description: "Sneakers, boots, and formal shoes",
      shortDescription: "Footwear",
      icon: "shoes",
      color: "purple",
      parent: createdMainCategories[2].id,
      level: 1,
      sortOrder: 2,
      isActive: true,
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
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Watches",
      slug: "watches",
      description: "Smart watches and luxury timepieces",
      shortDescription: "Timepieces",
      icon: "watch",
      color: "purple",
      parent: createdMainCategories[2].id,
      level: 1,
      sortOrder: 4,
      isActive: true,
    },

    // Health & Beauty subcategories
    {
      name: "Skincare",
      slug: "skincare",
      description: "Face care, moisturizers, and treatments",
      shortDescription: "Skin treatments",
      icon: "sparkles",
      color: "pink",
      parent: createdMainCategories[3].id,
      level: 1,
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Makeup",
      slug: "makeup",
      description: "Cosmetics and beauty products",
      shortDescription: "Beauty & cosmetics",
      icon: "sparkles",
      color: "pink",
      parent: createdMainCategories[3].id,
      level: 1,
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Wellness",
      slug: "wellness",
      description: "Health supplements and wellness products",
      shortDescription: "Health & wellness",
      icon: "heart",
      color: "pink",
      parent: createdMainCategories[3].id,
      level: 1,
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Fitness",
      slug: "fitness",
      description: "Exercise equipment and fitness gear",
      shortDescription: "Fitness equipment",
      icon: "dumbbell",
      color: "pink",
      parent: createdMainCategories[3].id,
      level: 1,
      sortOrder: 4,
      isActive: true,
    },
  ]

  const createdSubcategories = []
  for (const subcategory of subcategories) {
    const created = await payload.create({
      collection: "categories",
      data: subcategory,
    })
    createdSubcategories.push(created)
    console.log("Created subcategory:", created.name)
  }

  // Create sample products
  const sampleProducts = [
    {
      title: "Apple MacBook Air M2 13-inch",
      slug: "apple-macbook-air-m2-13",
      description:
        "The new MacBook Air with M2 chip delivers incredible performance and battery life in an ultra-thin design.",
      shortDescription: "Powerful M2 chip, 13-inch display, all-day battery life",
      category: createdSubcategories.find((c) => c.slug === "laptops").id,
      brand: "Apple",
      pricing: {
        originalPrice: 1199.0,
        currentPrice: 999.0,
        discountPercentage: 17,
      },
      rating: 4.8,
      reviewCount: 2847,
      affiliateUrl: "https://amazon.com/dp/example1",
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
      ],
    },
    {
      title: "Sony WH-1000XM5 Wireless Headphones",
      slug: "sony-wh-1000xm5-headphones",
      description: "Industry-leading noise canceling with premium sound quality and comfort.",
      shortDescription: "Premium noise canceling, 30-hour battery, crystal clear calls",
      category: createdSubcategories.find((c) => c.slug === "headphones").id,
      brand: "Sony",
      pricing: {
        originalPrice: 399.0,
        currentPrice: 299.0,
        discountPercentage: 25,
      },
      rating: 4.9,
      reviewCount: 1523,
      affiliateUrl: "https://amazon.com/dp/example2",
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
      ],
    },
    {
      title: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      description: "The ultimate iPhone with titanium design and advanced camera system.",
      shortDescription: "Titanium build, A17 Pro chip, advanced camera system",
      category: createdSubcategories.find((c) => c.slug === "smartphones").id,
      brand: "Apple",
      pricing: {
        originalPrice: 1199.0,
        currentPrice: 1199.0,
        discountPercentage: 0,
      },
      rating: 4.9,
      reviewCount: 5234,
      affiliateUrl: "https://amazon.com/dp/example3",
      merchant: "amazon",
      status: {
        isFeatured: false,
        isTrending: true,
        isActive: true,
      },
    },
    {
      title: "Nike Air Max 270 Sneakers",
      slug: "nike-air-max-270-sneakers",
      description: "Comfortable lifestyle sneakers with Max Air cushioning.",
      shortDescription: "Max Air cushioning, breathable mesh, iconic design",
      category: createdSubcategories.find((c) => c.slug === "shoes").id,
      brand: "Nike",
      pricing: {
        originalPrice: 150.0,
        currentPrice: 120.0,
        discountPercentage: 20,
      },
      rating: 4.6,
      reviewCount: 3421,
      affiliateUrl: "https://amazon.com/dp/example4",
      merchant: "amazon",
      status: {
        isFeatured: true,
        isTrending: true,
        isActive: true,
      },
    },
    {
      title: "Dyson V15 Detect Cordless Vacuum",
      slug: "dyson-v15-detect-vacuum",
      description: "Advanced laser technology reveals microscopic dust for a deep clean.",
      shortDescription: "Laser dust detection, powerful suction, 60-minute runtime",
      category: createdMainCategories[1].id, // Home & Garden main category
      brand: "Dyson",
      pricing: {
        originalPrice: 749.0,
        currentPrice: 599.0,
        discountPercentage: 20,
      },
      rating: 4.7,
      reviewCount: 892,
      affiliateUrl: "https://amazon.com/dp/example5",
      merchant: "amazon",
      status: {
        isFeatured: true,
        isTrending: false,
        isActive: true,
      },
    },
    {
      title: "The Ordinary Niacinamide 10% + Zinc 1%",
      slug: "the-ordinary-niacinamide-serum",
      description: "High-strength vitamin and mineral blemish formula.",
      shortDescription: "Reduces appearance of blemishes and congestion",
      category: createdSubcategories.find((c) => c.slug === "skincare").id,
      brand: "The Ordinary",
      pricing: {
        originalPrice: 7.0,
        currentPrice: 6.0,
        discountPercentage: 14,
      },
      rating: 4.4,
      reviewCount: 12847,
      affiliateUrl: "https://amazon.com/dp/example6",
      merchant: "amazon",
      status: {
        isFeatured: false,
        isTrending: true,
        isActive: true,
      },
    },
  ]

  for (const product of sampleProducts) {
    const created = await payload.create({
      collection: "products",
      data: product,
    })
    console.log("Created product:", created.title)
  }

  console.log("Seeding completed with subcategories!")
  process.exit(0)
}

seed().catch((error) => {
  console.error("Seeding failed:", error)
  process.exit(1)
})
