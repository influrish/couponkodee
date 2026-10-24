"use client"

import { useState } from "react"

interface StoreLogoImageProps {
  src?: string | null
  alt: string
  initial: string
  bg?: string
  className?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

export function StoreLogoImage({
  src,
  alt,
  initial,
  bg = "bg-slate-900",
  className = "",
  size = "md",
}: StoreLogoImageProps) {
  const [error, setError] = useState(false)

  const sizeClasses = {
    xs: "h-[31px] w-[31px] sm:h-7 sm:w-7 rounded-lg text-xs p-0.5",
    sm: "h-[43px] w-[43px] sm:h-10 sm:w-10 rounded-xl text-xs p-1",
    md: "h-[51px] w-[51px] sm:h-12 sm:w-12 rounded-xl text-sm p-1.5",
    lg: "h-[67px] w-[67px] sm:h-16 sm:w-16 rounded-2xl text-lg p-2",
    xl: "h-[99px] w-[99px] sm:h-24 sm:w-24 rounded-2xl text-2xl p-2.5",
  }[size]

  if (!src || error) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center font-bold text-white shadow-sm ${bg} ${sizeClasses} ${className}`}
        title={alt}
      >
        <span>{initial}</span>
      </div>
    )
  }

  return (
    <div
      className={`shrink-0 flex items-center justify-center overflow-hidden bg-white border border-slate-200/90 shadow-2xs ${sizeClasses} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain"
        onError={() => setError(true)}
      />
    </div>
  )
}
