import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = { title: "Page Not Found | CouponKodee", robots: { index: false } }

// Routes unknown URLs through (frontend)/not-found.tsx so they get the site header and footer.
export default function UnknownPage() {
  notFound()
}
