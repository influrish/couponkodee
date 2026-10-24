import type React from "react"
import type { Metadata } from "next"

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Sign In | CouponKodee",
  description: "Sign in to CouponKodee to track your savings and cashback.",
  robots: { index: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
