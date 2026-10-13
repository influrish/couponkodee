"use client"

import React from "react"

interface CountryFlagProps {
  code?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

interface FlagSvgProps {
  label: string
  size: "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
}

function FlagSvg({ label, size, className = "", children }: FlagSvgProps) {
  const dims = {
    sm: { width: 18, height: 12 },
    md: { width: 22, height: 15 },
    lg: { width: 27, height: 18 },
  }[size]

  return (
    <svg
      viewBox="0 0 30 20"
      width={dims.width}
      height={dims.height}
      preserveAspectRatio="none"
      className={`country-flag-svg shrink-0 overflow-hidden rounded-[3px] border border-black/15 shadow-xs inline-block align-middle select-none ${className}`}
      style={{
        padding: 0,
        margin: 0,
        width: dims.width,
        height: dims.height,
        minWidth: dims.width,
        minHeight: dims.height,
        maxWidth: dims.width,
        maxHeight: dims.height,
        boxSizing: "border-box",
        display: "inline-block",
      }}
      aria-label={label}
    >
      {children}
    </svg>
  )
}

export function CountryFlag({ code = "IN", className = "", size = "md" }: CountryFlagProps) {
  const c = (code || "IN").toUpperCase().trim()

  // Render SVG flag based on country code
  switch (c) {
    case "IN":
      return (
        <FlagSvg label="Flag of India" size={size} className={className}>
          {/* Top Saffron Stripe */}
          <rect width="30" height="6.67" fill="#FF9933" />
          {/* Middle White Stripe */}
          <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
          {/* Bottom Green Stripe */}
          <rect y="13.33" width="30" height="6.67" fill="#128807" />
          {/* Ashoka Chakra */}
          <circle cx="15" cy="10" r="2.4" fill="none" stroke="#000080" strokeWidth="0.5" />
          <circle cx="15" cy="10" r="0.6" fill="#000080" />
          {/* Spokes */}
          <g stroke="#000080" strokeWidth="0.25">
            <line x1="15" y1="7.7" x2="15" y2="12.3" />
            <line x1="12.7" y1="10" x2="17.3" y2="10" />
            <line x1="13.37" y1="8.37" x2="16.63" y2="11.63" />
            <line x1="13.37" y1="11.63" x2="16.63" y2="8.37" />
            <line x1="14.15" y1="7.85" x2="15.85" y2="12.15" />
            <line x1="15.85" y1="7.85" x2="14.15" y2="12.15" />
            <line x1="12.85" y1="9.15" x2="17.15" y2="10.85" />
            <line x1="12.85" y1="10.85" x2="17.15" y2="9.15" />
          </g>
        </FlagSvg>
      )

    case "US":
      return (
        <FlagSvg label="Flag of United States" size={size} className={className}>
          {/* 13 Red and White Stripes */}
          <rect width="30" height="20" fill="#B22234" />
          <rect y="1.54" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="4.62" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="7.69" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="10.77" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="13.85" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="16.92" width="30" height="1.54" fill="#FFFFFF" />
          {/* Blue Canton */}
          <rect width="12" height="10.77" fill="#3C3B6E" />
          {/* Grid of Stars */}
          <g fill="#FFFFFF">
            <circle cx="2" cy="1.8" r="0.5" />
            <circle cx="4.5" cy="1.8" r="0.5" />
            <circle cx="7" cy="1.8" r="0.5" />
            <circle cx="9.5" cy="1.8" r="0.5" />
            <circle cx="3.25" cy="3.6" r="0.5" />
            <circle cx="5.75" cy="3.6" r="0.5" />
            <circle cx="8.25" cy="3.6" r="0.5" />
            <circle cx="2" cy="5.4" r="0.5" />
            <circle cx="4.5" cy="5.4" r="0.5" />
            <circle cx="7" cy="5.4" r="0.5" />
            <circle cx="9.5" cy="5.4" r="0.5" />
            <circle cx="3.25" cy="7.2" r="0.5" />
            <circle cx="5.75" cy="7.2" r="0.5" />
            <circle cx="8.25" cy="7.2" r="0.5" />
            <circle cx="2" cy="9" r="0.5" />
            <circle cx="4.5" cy="9" r="0.5" />
            <circle cx="7" cy="9" r="0.5" />
            <circle cx="9.5" cy="9" r="0.5" />
          </g>
        </FlagSvg>
      )

    case "UK":
    case "GB":
      return (
        <FlagSvg label="Flag of United Kingdom" size={size} className={className}>
          {/* Blue field */}
          <rect width="30" height="20" fill="#012169" />
          {/* White saltire */}
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" strokeWidth="4" />
          {/* Red saltire */}
          <path d="M0,0 L15,10 M30,20 L15,10 M30,0 L15,10 M0,20 L15,10" stroke="#C8102E" strokeWidth="1.6" />
          {/* White cross */}
          <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" strokeWidth="6" />
          {/* Red cross */}
          <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.6" />
        </FlagSvg>
      )

    case "AE":
      return (
        <FlagSvg label="Flag of United Arab Emirates" size={size} className={className}>
          {/* Horizontal Green */}
          <rect x="7.5" y="0" width="22.5" height="6.67" fill="#00732F" />
          {/* Horizontal White */}
          <rect x="7.5" y="6.67" width="22.5" height="6.67" fill="#FFFFFF" />
          {/* Horizontal Black */}
          <rect x="7.5" y="13.33" width="22.5" height="6.67" fill="#000000" />
          {/* Vertical Red Hoist Stripe */}
          <rect x="0" y="0" width="7.5" height="20" fill="#FF0000" />
        </FlagSvg>
      )

    case "CA":
      return (
        <FlagSvg label="Flag of Canada" size={size} className={className}>
          {/* Left Red Stripe */}
          <rect width="7.5" height="20" fill="#D80621" />
          {/* Center White Square */}
          <rect x="7.5" width="15" height="20" fill="#FFFFFF" />
          {/* Right Red Stripe */}
          <rect x="22.5" width="7.5" height="20" fill="#D80621" />
          {/* Center Maple Leaf */}
          <path
            d="M15,4 L16,7 L18.5,6.5 L17.5,9 L20,10 L19,11.5 L16.5,11 L16.8,14 L15.5,14 L15.5,16.5 L14.5,16.5 L14.5,14 L13.2,14 L13.5,11 L11,11.5 L10,10 L12.5,9 L11.5,6.5 L14,7 Z"
            fill="#D80621"
          />
        </FlagSvg>
      )

    case "AU":
      return (
        <FlagSvg label="Flag of Australia" size={size} className={className}>
          {/* Blue field */}
          <rect width="30" height="20" fill="#00008B" />
          {/* Mini Union Jack canton */}
          <g>
            <rect width="15" height="10" fill="#012169" />
            <path d="M0,0 L15,10 M15,0 L0,10" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M0,0 L7.5,5 M15,10 L7.5,5 M15,0 L7.5,5 M0,10 L7.5,5" stroke="#C8102E" strokeWidth="0.8" />
            <path d="M7.5,0 V10 M0,5 H15" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M7.5,0 V10 M0,5 H15" stroke="#C8102E" strokeWidth="1.8" />
          </g>
          {/* Commonwealth Star */}
          <polygon
            points="7.5,13 8.3,14.5 10,14.5 8.7,15.6 9.2,17.2 7.5,16.2 5.8,17.2 6.3,15.6 5,14.5 6.7,14.5"
            fill="#FFFFFF"
          />
          {/* Southern Cross Stars */}
          <g fill="#FFFFFF">
            <circle cx="22.5" cy="4" r="0.6" />
            <circle cx="25.5" cy="7.5" r="0.6" />
            <circle cx="22.5" cy="14" r="0.6" />
            <circle cx="19.5" cy="9.5" r="0.6" />
            <circle cx="23.8" cy="10.8" r="0.4" />
          </g>
        </FlagSvg>
      )

    case "SG":
      return (
        <FlagSvg label="Flag of Singapore" size={size} className={className}>
          {/* Top Red */}
          <rect width="30" height="10" fill="#ED2939" />
          {/* Bottom White */}
          <rect y="10" width="30" height="10" fill="#FFFFFF" />
          {/* Crescent Moon */}
          <circle cx="5.5" cy="5" r="3.2" fill="#FFFFFF" />
          <circle cx="6.6" cy="5" r="3" fill="#ED2939" />
          {/* 5 Stars */}
          <g fill="#FFFFFF">
            <circle cx="7.5" cy="3.2" r="0.4" />
            <circle cx="9" cy="4.2" r="0.4" />
            <circle cx="8.5" cy="6" r="0.4" />
            <circle cx="6.8" cy="6" r="0.4" />
            <circle cx="6.3" cy="4.2" r="0.4" />
          </g>
        </FlagSvg>
      )

    case "DE":
      return (
        <FlagSvg label="Flag of Germany" size={size} className={className}>
          {/* Top Black */}
          <rect width="30" height="6.67" fill="#000000" />
          {/* Middle Red */}
          <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
          {/* Bottom Gold */}
          <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
        </FlagSvg>
      )

    case "GLOBAL":
    case "GL":
    case "ALL":
    default:
      return (
        <FlagSvg label="Global / All Regions" size={size} className={className}>
          {/* Gradient Background */}
          <defs>
            <linearGradient id="globalGradFixed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <rect width="30" height="20" fill="url(#globalGradFixed)" />
          {/* Globe Grid lines */}
          <circle cx="15" cy="10" r="7.5" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <ellipse cx="15" cy="10" rx="3.8" ry="7.5" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
          <line x1="7.5" y1="10" x2="22.5" y2="10" stroke="#FFFFFF" strokeWidth="0.8" />
          <line x1="9.5" y1="6" x2="20.5" y2="6" stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="1,0.5" />
          <line x1="9.5" y1="14" x2="20.5" y2="14" stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="1,0.5" />
        </FlagSvg>
      )
  }
}

