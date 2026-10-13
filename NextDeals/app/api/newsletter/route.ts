import { type NextRequest, NextResponse } from "next/server"
import { getPayloadClient } from "@/src/lib/payload"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // Check if email already exists
    const existingSubscriber = await payload.find({
      collection: "newsletter-subscribers",
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingSubscriber.docs.length > 0) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 409 })
    }

    // Create new subscriber
    const subscriber = await payload.create({
      collection: "newsletter-subscribers",
      data: {
        email,
        firstName,
        lastName,
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
