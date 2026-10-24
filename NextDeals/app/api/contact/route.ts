import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
export const dynamic = "force-dynamic"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LIMITS = { name: 100, subject: 200, message: 5000 }

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(`contact:${getClientIp(request)}`, 5, 10 * 60_000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    )
  }

  const body = await request.json().catch(() => ({}))
  const name = text(body.name, LIMITS.name)
  const email = text(body.email, 254).toLowerCase()
  const subject = text(body.subject, LIMITS.subject)
  const message = text(body.message, LIMITS.message)

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 })
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }
  if (!subject) {
    return NextResponse.json({ error: "Please enter a subject." }, { status: 400 })
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Please enter a message of at least 10 characters." }, { status: 400 })
  }

  try {
    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    await payload.create({
      collection: "contact-messages",
      data: { name, email, subject, message, status: "new" },
    })

    return NextResponse.json({ success: true, message: "Thanks! We'll get back to you within 24-48 business hours." })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please email us directly." },
      { status: 503 }
    )
  }
}
