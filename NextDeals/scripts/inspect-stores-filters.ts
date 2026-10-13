import { initialStores } from "../lib/stores-data"
import { getDbStores } from "../lib/db-stores"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

async function inspect() {
  const stores = await getDbStores()
  console.log("Total stores:", stores.length)
  console.log("Popular count:", stores.filter(s => s.isPopular).length)
  console.log("Cashback count:", stores.filter(s => s.hasCashback && s.cashbackRate).length)
  console.log("Coupons count:", stores.filter(s => s.hasCoupons).length)
  console.log("Coupons > 15 count:", stores.filter(s => (s.couponsCount || 0) > 15).length)
}

inspect().catch(console.error).finally(() => process.exit(0))

