import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
export const dynamic = "force-dynamic"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function optionalName(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 80) : undefined
}

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(`newsletter:${getClientIp(request)}`, 5, 60_000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()

    // Check if email already exists
    const existingSubscriber = await payload.find({
      collection: "newsletter-subscribers",
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (existingSubscriber.docs.length > 0) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 409 })
    }

    // Create new subscriber
    const subscriber = await payload.create({
      collection: "newsletter-subscribers",
      data: {
        email,
        firstName: optionalName(body.firstName),
        lastName: optionalName(body.lastName),
        isActive: true,
        source: "website",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
      id: subscriber.id,
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Subscription is temporarily unavailable. Please try again later." }, { status: 503 })
  }
}
