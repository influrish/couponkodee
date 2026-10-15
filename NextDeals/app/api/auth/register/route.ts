import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name (at least 2 characters)." },
        { status: 400 }
      )
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      )
    }

    const { getPayloadClient } = await import("@/src/lib/payload")
    const payload = await getPayloadClient()
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existing = await payload.find({
      collection: "users",
      where: {
        email: { equals: normalizedEmail },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in instead." },
        { status: 400 }
      )
    }

    // Create consumer user
    const newUser = await payload.create({
      collection: "users",
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: "user",
      },
    })

    // Perform login to generate token
    let token: string | undefined
    try {
      const loginRes = await payload.login({
        collection: "users",
        data: {
          email: normalizedEmail,
          password,
        },
      })
      token = loginRes.token
    } catch (loginErr) {
      console.warn("Auto-login token generation notice:", loginErr)
    }

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully! ₹50 welcome bonus credited.",
      user: {
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || "user",
      },
      token,
    })

    if (token) {
      response.cookies.set("payload-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return response
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}
