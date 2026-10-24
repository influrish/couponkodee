/**
 * Sets a new password for an admin account (creating it if missing).
 * Usage: SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... pnpm admin:reset-password
 * Without SEED_ADMIN_PASSWORD a random password is generated and printed once.
 */
import { randomBytes } from "crypto"
import dotenv from "dotenv"
import { getPayload } from "payload"

dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env" })
const { default: config } = await import("../src/payload.config")

async function resetAdminPassword() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@couponkodee.com").trim().toLowerCase()
  const configuredPassword = process.env.SEED_ADMIN_PASSWORD?.trim()
  if (configuredPassword && configuredPassword.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters")
  }
  const password = configuredPassword || randomBytes(12).toString("base64url")

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1 })

  if (existing.docs.length > 0) {
    await payload.update({
      collection: "users",
      id: existing.docs[0].id,
      data: { password, role: "admin" },
    })
    console.log(`✅ Password updated for ${email}`)
  } else {
    await payload.create({
      collection: "users",
      data: { email, password, name: "Admin Manager", role: "admin" },
    })
    console.log(`✅ Created administrator ${email}`)
  }

  if (!configuredPassword) {
    console.log(`🔑 New password (shown once, store it safely): ${password}`)
  }
  process.exit(0)
}

resetAdminPassword().catch((err) => {
  console.error("❌ Failed to reset admin password:", err)
  process.exit(1)
})
