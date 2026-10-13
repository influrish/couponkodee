import dotenv from "dotenv"
dotenv.config()

import payload from "payload"

const seed = async () => {
  console.log("Seeding Payload CMS...")

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

  // Create categories
  const categories = [
    {
      name: "Electronics",
      slug: "electronics",
      description: "Latest gadgets, smartphones, laptops, and tech accessories",
      isActive: true,
    },
    {
      name: "Home & Garden",
      slug: "home-garden",
      description: "Everything for your home, from furniture to gardening tools",
      isActive: true,
    },
    {
      name: "Fashion",
      slug: "fashion",
      description: "Trending clothing, shoes, and accessories for all styles",
      isActive: true,
    },
    {
      name: "Health & Beauty",
      slug: "health-beauty",
      description: "Skincare, wellness products, and beauty essentials",
      isActive: true,
    },
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await payload.create({
      collection: "categories",
      data: category,
    })
    createdCategories.push(created)
    console.log("Created category:", created.name)
  }

  // Create sample products
  const sampleProducts = [
    {
      title: "Apple MacBook Air M2 13-inch",
      slug: "apple-macbook-air-m2-13",
      description:
        "The new MacBook Air with M2 chip delivers incredible performance and battery life in an ultra-thin design.",
      shortDescription: "Powerful M2 chip, 13-inch display, all-day battery life",
      category: createdCategories[0].id, // Electronics
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
      category: createdCategories[0].id, // Electronics
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
  ]

  for (const product of sampleProducts) {
    const created = await payload.create({
      collection: "products",
      data: product,
    })
    console.log("Created product:", created.title)
  }

  console.log("Seeding completed!")
  process.exit(0)
}

seed().catch((error) => {
  console.error("Seeding failed:", error)
  process.exit(1)
})
