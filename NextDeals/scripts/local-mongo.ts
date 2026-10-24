/**
 * Runs a local, persistent MongoDB for development without installing MongoDB
 * system-wide. The mongod binary is downloaded once (cached under
 * node_modules/.cache) and data is kept in .data/mongodb across restarts.
 *
 * Usage: pnpm db:local   (then keep this terminal open)
 * If you already run MongoDB yourself (brew, Docker, Atlas), you don't need this.
 */
import { mkdirSync } from "fs"
import path from "path"
import { MongoMemoryServer } from "mongodb-memory-server"

const port = Number(process.env.LOCAL_MONGO_PORT || 27017)
const dbPath = path.resolve(process.cwd(), process.env.LOCAL_MONGO_DATA_DIR || ".data/mongodb")

async function main() {
  mkdirSync(dbPath, { recursive: true })

  const server = await MongoMemoryServer.create({
    instance: {
      port,
      ip: "127.0.0.1",
      dbPath,
      storageEngine: "wiredTiger",
    },
  })

  console.log(`✅ Local MongoDB running at mongodb://127.0.0.1:${port}`)
  console.log(`   Data directory: ${dbPath}`)
  console.log(`   Set MONGODB_URI=mongodb://127.0.0.1:${port}/couponkodee in .env.local`)
  console.log("   Press Ctrl+C to stop.")

  const shutdown = async () => {
    // doCleanup: false keeps the data directory so data survives restarts
    await server.stop({ doCleanup: false })
    process.exit(0)
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

main().catch((err) => {
  console.error("❌ Failed to start local MongoDB:", err)
  console.error(`   Is something already listening on port ${port}? Set LOCAL_MONGO_PORT to use another port.`)
  process.exit(1)
})
