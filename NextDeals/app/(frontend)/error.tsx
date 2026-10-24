"use client"

import { useEffect } from "react"
import Link from "@/components/localized-link"

export default function FrontendError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Storefront render error:", error)
  }, [error])

  return (
    <div className="container py-24 text-center">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Something went wrong</h1>
      <p className="text-slate-600 mb-8">We couldn&apos;t load this page. Please try again in a moment.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full border border-slate-300 hover:border-purple-300 text-slate-700 text-sm font-bold transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
