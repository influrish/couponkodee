import { NextResponse } from "next/server"
import { isDatabaseConfigured } from "@/src/lib/db-config"
import { getLastDbFailureReason, isDatabaseReachable } from "@/src/lib/db-health"

export const dynamic = "force-dynamic"

const HINTS = {
  "not-configured": "MONGODB_URI is missing or still a placeholder in the environment variables.",
  auth: "The database rejected the username or password. Check MONGODB_URI (special characters must be URL-encoded).",
  network: "The connection timed out. In MongoDB Atlas, add 0.0.0.0/0 to the IP Access List.",
  dns: "The cluster address could not be resolved. Try Atlas's non-SRV (Legacy URI) connection string.",
  tls: "A secure connection to the database could not be established.",
  unknown: "The database did not respond. Check the Worker logs.",
} as const

/** Public health check. Reports a category only, never the address, user or password. */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, database: "error", reason: "not-configured", hint: HINTS["not-configured"] }, { status: 503 })
  }

  if (await isDatabaseReachable()) {
    return NextResponse.json({ ok: true, database: "connected" })
  }

  const reason = getLastDbFailureReason() ?? "unknown"
  return NextResponse.json({ ok: false, database: "error", reason, hint: HINTS[reason] }, { status: 503 })
}
