> **Note:** For local setup and the current environment variables, see [README.md](README.md). This guide is general background on running MongoDB at scale; its examples use the older `dealscope` database name.

# 🚀 MongoDB High Traffic Setup Guide

## Why MongoDB for High Traffic?

✅ **Horizontal Scaling**: Easy sharding across multiple servers  
✅ **High Performance**: Optimized for read-heavy workloads  
✅ **Flexible Schema**: Perfect for product catalogs  
✅ **Built-in Replication**: High availability out of the box  
✅ **Memory-Mapped Files**: Fast data access  
✅ **Aggregation Pipeline**: Complex queries with great performance  

## Quick Start

### 1. Install MongoDB

**macOS (Homebrew):**
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
\`\`\`

**Ubuntu/Debian:**
\`\`\`bash
sudo apt-get install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
\`\`\`

**Windows:**
Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)

### 2. Install Project Dependencies

\`\`\`bash
# Use the automated script
chmod +x scripts/install-mongodb.sh
./scripts/install-mongodb.sh

# Or manual installation
npm install
npm run generate:types
npm run build:payload
\`\`\`

### 3. Environment Configuration

\`\`\`bash
cp .env.example .env.local
\`\`\`

**Local Development:**
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/dealscope
\`\`\`

**Production (MongoDB Atlas):**
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dealscope?retryWrites=true&w=majority
\`\`\`

### 4. Seed Database

\`\`\`bash
npm run seed
\`\`\`

### 5. Start Development

\`\`\`bash
npm run dev
\`\`\`

## High Traffic Optimizations

### Database Indexes

The project automatically creates optimized indexes:

\`\`\`javascript
// Product search performance
db.products.createIndex({ 
  "title": "text", 
  "description": "text", 
  "brand": "text" 
});

// Category filtering
db.products.createIndex({ 
  "category": 1, 
  "status.isActive": 1 
});

// Price range queries
db.products.createIndex({ 
  "pricing.currentPrice": 1, 
  "status.isActive": 1 
});

// Featured/trending products
db.products.createIndex({ 
  "status.isFeatured": 1, 
  "status.isActive": 1 
});
\`\`\`

### Connection Pooling

\`\`\`javascript
// Optimized for high traffic
connectOptions: {
  maxPoolSize: 20,        // Max connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,    // Disable buffering
  bufferCommands: false,
}
\`\`\`

### Sharding Strategy (Production)

For 10M+ visitors, implement sharding:

\`\`\`javascript
// Shard key recommendations
sh.shardCollection("dealscope.products", { "category": 1, "_id": 1 })
sh.shardCollection("dealscope.pricehistories", { "product": 1, "createdAt": 1 })
\`\`\`

## Production Deployment

### MongoDB Atlas (Recommended)

1. **Create Cluster**: [MongoDB Atlas](https://cloud.mongodb.com)
2. **Choose Region**: Select closest to your users
3. **Configure Scaling**: Enable auto-scaling
4. **Set up Monitoring**: Enable performance advisor

### Self-Hosted MongoDB

\`\`\`yaml
# docker-compose.yml
services:
  mongodb:
    image: mongo:7.0
    command: mongod --wiredTigerCacheSizeGB 2 --wiredTigerCollectionBlockCompressor snappy
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
\`\`\`

### Replica Set Setup

\`\`\`bash
# Initialize replica set
mongosh --eval "rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongo1:27017' },
    { _id: 1, host: 'mongo2:27017' },
    { _id: 2, host: 'mongo3:27017' }
  ]
})"
\`\`\`

## Performance Monitoring

### Key Metrics to Track

\`\`\`javascript
// MongoDB performance queries
db.runCommand({ serverStatus: 1 })
db.runCommand({ dbStats: 1 })
db.products.getIndexes()
db.products.stats()
\`\`\`

### Monitoring Tools

- **MongoDB Compass**: GUI for database management
- **MongoDB Atlas Monitoring**: Built-in performance insights
- **New Relic**: Application performance monitoring
- **Datadog**: Infrastructure and database monitoring

## Scaling Roadmap

| Traffic Level | Setup | Monthly Cost | Key Features |
|---------------|-------|--------------|--------------|
| **10K-100K** | Single MongoDB instance | $0-25 | Local/Atlas M0 |
| **100K-1M** | Replica Set + Read Replicas | $50-200 | Atlas M10-M30 |
| **1M-10M** | Sharded Cluster + Caching | $500-2000 | Atlas M40+ |
| **10M+** | Multi-region + CDN | $2000+ | Global clusters |

## Caching Strategy

### Redis Integration

\`\`\`javascript
// High-traffic caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache frequently accessed data
const cacheProduct = async (productId, data) => {
  await client.setex(`product:${productId}`, 3600, JSON.stringify(data));
};

const getCachedProduct = async (productId) => {
  const cached = await client.get(`product:${productId}`);
  return cached ? JSON.parse(cached) : null;
};
\`\`\`

### Application-Level Caching

\`\`\`javascript
// Next.js ISR + MongoDB
export async function getStaticProps() {
  return {
    props: { products },
    revalidate: 3600, // 1 hour
  };
}
\`\`\`

## Security Best Practices

### Authentication & Authorization

\`\`\`javascript
// MongoDB user roles
db.createUser({
  user: "dealscope_app",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "dealscope" },
    { role: "dbAdmin", db: "dealscope" }
  ]
});
\`\`\`

### Network Security

\`\`\`bash
# MongoDB configuration
security:
  authorization: enabled
net:
  bindIp: 127.0.0.1,10.0.0.0/8
  port: 27017
\`\`\`

## Backup Strategy

### Automated Backups

\`\`\`bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/dealscope_$DATE"
aws s3 cp "/backups/dealscope_$DATE" s3://dealscope-backups/ --recursive
\`\`\`

### Point-in-Time Recovery

\`\`\`bash
# MongoDB Atlas automatic backups
# - Continuous backups every 6 hours
# - Point-in-time recovery up to last 7 days
# - Cross-region backup copies
\`\`\`

## Troubleshooting

### Common Issues

**Connection Timeout:**
\`\`\`bash
# Check MongoDB status
sudo systemctl status mongod
mongosh --eval "db.adminCommand('ping')"
\`\`\`

**High Memory Usage:**
\`\`\`javascript
// Monitor memory usage
db.runCommand({ serverStatus: 1 }).mem
db.runCommand({ collStats: "products" })
\`\`\`

**Slow Queries:**
\`\`\`javascript
// Enable profiler
db.setProfilingLevel(2, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)
\`\`\`

### Performance Optimization

\`\`\`javascript
// Optimize queries
db.products.find({ "status.isActive": true }).hint({ "status.isActive": 1 })
db.products.aggregate([
  { $match: { "status.isActive": true } },
  { $sort: { "pricing.currentPrice": 1 } },
  { $limit: 20 }
])
\`\`\`

## Migration from PostgreSQL

If migrating from PostgreSQL:

\`\`\`bash
# Export PostgreSQL data
pg_dump dealscope > dealscope_backup.sql

# Convert to MongoDB format
node scripts/postgres-to-mongodb-migration.js

# Import to MongoDB
mongoimport --db dealscope --collection products --file products.json
\`\`\`

## Support & Resources

- 📚 [MongoDB Documentation](https://docs.mongodb.com/)
- 🎓 [MongoDB University](https://university.mongodb.com/)
- 💬 [MongoDB Community Forums](https://community.mongodb.com/)
- 🔧 [Payload CMS MongoDB Docs](https://payloadcms.com/docs/database/mongodb)

---

**Ready for High Traffic! 🚀**

Your couponkodee affiliate site is now optimized for millions of visitors with MongoDB's powerful scaling capabilities.
