const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient('mongodb://127.0.0.1:27017/dealscope');
  await client.connect();
  const db = client.db('dealscope');

  // Check cashback visibility setting
  const siteSettings = await db.collection('site-settings').findOne({});
  const isCashbackEnabled = siteSettings?.cashbackVisibility === 'on';
  console.log('isCashbackEnabled in DB:', isCashbackEnabled);

  const stores = await db.collection('stores').find({ isActive: true }).toArray();
  console.log(`Found ${stores.length} active stores in dealscope`);

  for (const s of stores) {
    const couponCount = await db.collection('coupon-offers').countDocuments({
      isActive: true,
      $or: [{ merchantSlug: s.slug }, { store: s._id }, { store: String(s._id) }]
    });

    const productCount = await db.collection('products').countDocuments({
      'status.isActive': true,
      $or: [{ merchant: s.slug }, { store: s._id }, { store: String(s._id) }]
    });

    let cashbackCount = 0;
    if (isCashbackEnabled) {
      cashbackCount = await db.collection('cashback-offers').countDocuments({
        isActive: true,
        $or: [{ merchantSlug: s.slug }, { store: s._id }, { store: String(s._id) }]
      });
      if (s.cashbackRate && cashbackCount === 0) {
        cashbackCount = 1;
      }
    }

    const exactCount = couponCount + productCount + cashbackCount;
    await db.collection('stores').updateOne(
      { _id: s._id },
      { $set: { couponsCount: exactCount } }
    );
    console.log(`Updated ${s.slug}: couponsCount ${s.couponsCount} -> ${exactCount}`);
  }

  await client.close();
  console.log('Finished updating stores collection in MongoDB');
}

main().catch(console.error);

