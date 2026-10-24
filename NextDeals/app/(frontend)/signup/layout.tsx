import type React from "react"
import type { Metadata } from "next"

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Join Free | CouponKodee",
  description: "Create a free CouponKodee account to save with verified coupons, deals and cashback.",
  robots: { index: false },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
