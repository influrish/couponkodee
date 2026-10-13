const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient('mongodb://127.0.0.1:27017/dealscope');
  await client.connect();
  const db = client.db('dealscope');
  const stores = await db.collection('stores').find({ isActive: true }).toArray();
  console.log(`Found ${stores.length} active stores in DB`);
  for (const s of stores) {
    const c = await db.collection('coupon-offers').countDocuments({
      isActive: true,
      $or: [{ merchantSlug: s.slug }, { store: s._id }, { store: String(s._id) }]
    });
    const p = await db.collection('products').countDocuments({
      'status.isActive': true,
      $or: [{ merchant: s.slug }, { store: s._id }, { store: String(s._id) }]
    });
    const cb = await db.collection('cashback-offers').countDocuments({
      isActive: true,
      $or: [{ merchantSlug: s.slug }, { store: s._id }, { store: String(s._id) }]
    });
    console.log(s.slug.padEnd(20), 'coupons:', c, 'prods:', p, 'cashbacks:', cb, 'totalDB:', c+p+cb, 'couponsCountField:', s.couponsCount);
  }
  await client.close();
}

main().catch(console.error);

