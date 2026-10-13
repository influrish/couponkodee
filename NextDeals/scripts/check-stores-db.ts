import { getPayloadClient } from "../src/lib/payload"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

async function checkStores() {
  const p = await getPayloadClient()
  const stores = await p.find({ collection: "stores", limit: 100 })
  console.log("Total stores:", stores.docs.length)
  for (const s of stores.docs) {
    console.log({
      name: s.name,
      slug: s.slug,
      isPopular: s.isPopular,
      hasCashback: s.hasCashback,
      hasCoupons: s.hasCoupons,
      cashbackRate: s.cashbackRate,
      couponsCount: s.couponsCount,
    })
  }
}

checkStores().catch(console.error).finally(() => process.exit(0))

