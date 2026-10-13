// MongoDB initialization script for high traffic optimization
const db = db.getSiblingDB("dealscope")

// Create indexes for high performance
db.categories.createIndex({ slug: 1 }, { unique: true })
db.categories.createIndex({ parent: 1, level: 1 })
db.categories.createIndex({ isActive: 1, isFeatured: 1 })
db.categories.createIndex({ sortOrder: 1, level: 1 })

db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ category: 1, "status.isActive": 1 })
db.products.createIndex({ "status.isFeatured": 1, "status.isActive": 1 })
db.products.createIndex({ "status.isTrending": 1, "status.isActive": 1 })
db.products.createIndex({ "pricing.currentPrice": 1, "status.isActive": 1 })
db.products.createIndex({ rating: -1, "status.isActive": 1 })
db.products.createIndex({ createdAt: -1 })

// Text search indexes
db.products.createIndex({
  title: "text",
  description: "text",
  shortDescription: "text",
  brand: "text",
})

db.categories.createIndex({
  name: "text",
  description: "text",
})

// Price history indexes for time-series optimization
db.pricehistories.createIndex({ product: 1, createdAt: -1 })
db.pricehistories.createIndex({ createdAt: -1 })

// Newsletter subscribers
db.newslettersubscribers.createIndex({ email: 1 }, { unique: true })
db.newslettersubscribers.createIndex({ isActive: 1 })

// Users
db.users.createIndex({ email: 1 }, { unique: true })

print("MongoDB indexes created for high traffic optimization")
