"use client"

import { useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"

interface StickyStoreCtaProps {
  storeName: string
  href: string
  /** id of the page's main CTA; the bar shows only while that button is off-screen. */
  watchId: string
  offerCount: number
}

/** Mobile-only bottom bar that keeps "Shop at {store}" one tap away while scrolling offers. */
export function StickyStoreCta({ storeName, href, watchId, offerCount }: StickyStoreCtaProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(watchId)
    if (!target || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    observer.observe(target)
    return () => observer.disconnect()
  }, [watchId])

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur transition-transform duration-200 sm:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">{storeName}</p>
          <p className="text-xs text-slate-500">
            {offerCount} verified {offerCount === 1 ? "offer" : "offers"}
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-purple-700 px-5 text-sm font-bold text-white shadow-sm active:scale-[0.98]"
        >
          Shop now <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
