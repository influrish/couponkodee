"use client"

import { useState } from "react"
import Link from "@/components/localized-link"
import { ChevronDown, ShieldCheck } from "lucide-react"
import { FooterData, defaultFooterData } from "@/lib/cms-types"
import { BrandLogo } from "@/components/brand-logo"

interface FooterProps {
  initialData?: FooterData
  isCashbackEnabled?: boolean
}

export function Footer({ initialData, isCashbackEnabled = false }: FooterProps) {
  const data = initialData || defaultFooterData
  const brand = data.brand || defaultFooterData.brand
  const social = data.socialLinks || defaultFooterData.socialLinks
  const rawColumns = data.columns && data.columns.length > 0 ? data.columns : defaultFooterData.columns
  const columns = rawColumns.map((col) => ({
    ...col,
    links: isCashbackEnabled
      ? col.links
      : col.links.filter(
          (link) => link.url !== "/cashback" && !/cashback/i.test(link.label)
        ),
  }))
  const disclosure = data.disclosure || defaultFooterData.disclosure
  const copyright = data.copyright || defaultFooterData.copyright
  const appearance = data.appearance || defaultFooterData.appearance || {}

  const themePreset = appearance.themePreset || "white"
  const customBgColor = appearance.customBgColor
  const customTextColor = appearance.customTextColor
  const accentColor = appearance.accentColor || "purple"
  const customAccentColor = appearance.customAccentColor
  const socialIconStyle = appearance.socialIconStyle || "colored-circle"
  const showSocialLinks = appearance.showSocialLinks !== false
  const showCopyrightBar = appearance.showCopyrightBar !== false

  const currentYear = new Date().getFullYear().toString()
  const formattedCopyright = (
    copyright.text || "© {year} CouponKodee. All rights reserved. Made for smart shoppers."
  ).replace(/\{year\}/g, currentYear)

  // Theme Presets
  const themeConfig = {
    white: {
      footer: "bg-white text-slate-700 border-t border-slate-200",
      heading: "text-slate-900",
      subtext: "text-slate-600",
      muted: "text-slate-500",
      taglineBg: "bg-purple-50 text-purple-700 border-purple-100",
      disclosure: "bg-slate-50 border-slate-200 text-slate-600",
      disclosureTitle: "text-slate-800",
      divider: "border-slate-200",
      legalMuted: "text-slate-500",
    },
    cream: {
      footer: "bg-[#FAF7F2] text-[#4A4740] border-t border-[#E8E3D9]",
      heading: "text-[#1E1B18]",
      subtext: "text-[#5C574F]",
      muted: "text-[#7A746B]",
      taglineBg: "bg-[#F0EBE1] text-[#694808] border-[#DFD8CA]",
      disclosure: "bg-[#F3EFE7] border-[#E8E3D9] text-[#4A4740]",
      disclosureTitle: "text-[#1E1B18]",
      divider: "border-[#E8E3D9]",
      legalMuted: "text-[#7A746B]",
    },
    slate: {
      footer: "bg-slate-50 text-slate-700 border-t border-slate-200",
      heading: "text-slate-900",
      subtext: "text-slate-600",
      muted: "text-slate-500",
      taglineBg: "bg-slate-200/70 text-slate-800 border-slate-300",
      disclosure: "bg-white border-slate-200 text-slate-600",
      disclosureTitle: "text-slate-800",
      divider: "border-slate-200",
      legalMuted: "text-slate-500",
    },
    dark: {
      footer: "bg-[#0F172A] text-slate-300 border-t border-slate-800",
      heading: "text-white",
      subtext: "text-slate-300",
      muted: "text-slate-400",
      taglineBg: "bg-slate-800 text-purple-300 border-slate-700",
      disclosure: "bg-slate-900 border-slate-800 text-slate-300",
      disclosureTitle: "text-white",
      divider: "border-slate-800",
      legalMuted: "text-slate-400",
    },
    custom: {
      footer: "border-t border-slate-200/40",
      heading: "font-bold text-inherit",
      subtext: "opacity-90",
      muted: "opacity-75",
      taglineBg: "bg-black/5 border-current/15",
      disclosure: "bg-black/5 border-current/15",
      disclosureTitle: "font-bold text-inherit",
      divider: "border-current/15",
      legalMuted: "opacity-75",
    },
  }[themePreset] || {
    footer: "bg-white text-slate-700 border-t border-slate-200",
    heading: "text-slate-900",
    subtext: "text-slate-600",
    muted: "text-slate-500",
    taglineBg: "bg-purple-50 text-purple-700 border-purple-100",
    disclosure: "bg-slate-50 border-slate-200 text-slate-600",
    disclosureTitle: "text-slate-800",
    divider: "border-slate-200",
    legalMuted: "text-slate-500",
  }

  // Accent & Link Hover Configuration
  const accentConfig = {
    purple: {
      linkHover: "hover:text-purple-600",
      iconColor: "text-purple-600",
      highlightText: "text-purple-700 font-bold",
    },
    emerald: {
      linkHover: "hover:text-emerald-600",
      iconColor: "text-emerald-600",
      highlightText: "text-emerald-700 font-bold",
    },
    indigo: {
      linkHover: "hover:text-indigo-600",
      iconColor: "text-indigo-600",
      highlightText: "text-indigo-700 font-bold",
    },
    orange: {
      linkHover: "hover:text-orange-600",
      iconColor: "text-orange-600",
      highlightText: "text-orange-700 font-bold",
    },
    blue: {
      linkHover: "hover:text-blue-600",
      iconColor: "text-blue-600",
      highlightText: "text-blue-700 font-bold",
    },
    custom: {
      linkHover: "hover:opacity-80",
      iconColor: "text-current",
      highlightText: "font-bold underline",
    },
  }[accentColor] || {
    linkHover: "hover:text-purple-600",
    iconColor: "text-purple-600",
    highlightText: "text-purple-700 font-bold",
  }

  // Helper for social icons styling
  const getSocialBtnClass = (brandBg: string) => {
    if (socialIconStyle === "monochrome-dark") {
      return "w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 hover:scale-108 active:scale-95 transition-all shadow-xs"
    }
    if (socialIconStyle === "rounded-square") {
      return `w-9 h-9 rounded-xl ${brandBg} text-white flex items-center justify-center hover:opacity-90 hover:scale-108 active:scale-95 transition-all shadow-xs`
    }
    if (socialIconStyle === "outline") {
      return `w-9 h-9 rounded-full border-2 border-slate-300 text-slate-700 flex items-center justify-center hover:border-current ${accentConfig.linkHover} hover:scale-108 active:scale-95 transition-all shadow-xs`
    }
    // Default: colored-circle
    return `w-9 h-9 rounded-full ${brandBg} text-white flex items-center justify-center hover:opacity-90 hover:scale-108 active:scale-95 transition-all shadow-xs`
  }

  const gridColsClass = showSocialLinks
    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10"
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10"

  const customFooterStyle: React.CSSProperties = {}
  if (themePreset === "custom") {
    if (customBgColor) customFooterStyle.backgroundColor = customBgColor
    if (customTextColor) customFooterStyle.color = customTextColor
  }

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Mobile accordion links resolution
  const companyCol = columns.find((c) => /company/i.test(c.title)) || defaultFooterData.columns[0]
  const importantCol = columns.find((c) => /important/i.test(c.title)) || defaultFooterData.columns[1]
  const exploreCol = columns.find((c) => /explore/i.test(c.title)) || defaultFooterData.columns[2]

  const companyLinks = companyCol.links
  const importantLinks = importantCol.links
  const exploreLinks = exploreCol.links

  return (
    <footer
      className={`site-footer ${themeConfig.footer} transition-colors`}
      style={Object.keys(customFooterStyle).length > 0 ? customFooterStyle : undefined}
    >
      {/* DESKTOP / TABLET FOOTER (>= 640px) UNCHANGED */}
      <div className="hidden sm:block container py-12 lg:py-16">
        {/* Main Grid */}
        <div className={gridColsClass}>
          
          {/* COLUMN 1: Brand Info */}
          <div className="space-y-3.5">
            {/* Brand Logo & Tagline */}
            <div>
              <BrandLogo
                brandName={brand.brandName}
                brandHighlight={brand.brandHighlight}
                customLogoUrl={brand.customLogoUrl}
                size="md"
                tone={themePreset === "dark" ? "light" : "dark"}
              />
              
              <div className="mt-1">
                <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${themeConfig.taglineBg}`}>
                  {isCashbackEnabled
                    ? (brand.tagline || "The Smart Savings & Cashback Hub")
                    : (brand.tagline || "The Smart Savings & Cashback Hub").replace(/&?\s*Cashback/gi, "& Deals").replace(/Cashback/gi, "Deals")}
                </span>
              </div>
            </div>

            {/* About Bio Text */}
            <p className={`text-xs leading-relaxed max-w-xs ${themeConfig.subtext}`}>
              {isCashbackEnabled
                ? brand.bio
                : brand.bio
                    .replace(/,\s*and real bank-transferable cashback/gi, "")
                    .replace(/and real bank-transferable cashback/gi, "")
                    .replace(/cashback/gi, "exclusive discounts")}
            </p>
          </div>

          {/* DYNAMIC MIDDLE COLUMNS (Defaults to: Our Company, Important Links, Explore) */}
          {columns.map((col, idx) => (
            <div key={`${col.title}-${idx}`} className="space-y-3.5">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${themeConfig.heading}`}>
                {col.title}
              </h3>
              <ul className="space-y-2 text-xs">
                {col.links.map((link, lIdx) => (
                  <li key={`${link.label}-${lIdx}`}>
                    <Link
                      href={link.url}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                      className={`${link.isHighlighted ? accentConfig.highlightText : themeConfig.subtext} ${accentConfig.linkHover} hover:translate-x-0.5 transition-all block py-0.5 font-medium`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* COLUMN 5: Follow Us (Conditional) */}
          {showSocialLinks && (
            <div className="space-y-3.5">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${themeConfig.heading}`}>
                Follow Us
              </h3>
              <p className={`text-xs leading-relaxed ${themeConfig.muted}`}>
                {isCashbackEnabled
                  ? "Stay updated with daily verified coupon drops & cashback alerts."
                  : "Stay updated with daily verified coupon drops & deal alerts."}
              </p>

              {/* Social Buttons Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2.5 w-fit pt-1">
              {/* Facebook */}
              {social.facebook && (
                <Link
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getSocialBtnClass("bg-[#1877F2]")}
                  aria-label="Follow CouponKodee on Facebook"
                  title="Facebook"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
              )}

              {/* Twitter / X */}
              {social.twitter && (
                <Link
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getSocialBtnClass("bg-slate-900")}
                  aria-label="Follow CouponKodee on X (Twitter)"
                  title="Twitter / X"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
              )}

              {/* Pinterest */}
              {social.pinterest && (
                <Link
                  href={social.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getSocialBtnClass("bg-[#E60023]")}
                  aria-label="Follow CouponKodee on Pinterest"
                  title="Pinterest"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026l.032-.026z" />
                  </svg>
                </Link>
              )}

              {/* WhatsApp */}
              {social.whatsapp && (
                <Link
                  href={social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getSocialBtnClass("bg-[#25D366]")}
                  aria-label="Subscribe to CouponKodee on WhatsApp"
                  title="WhatsApp"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.777-.877-2.053-.977-.275-.101-.476-.15-.676.15-.2.301-.776.977-.951 1.177-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.674-2.083-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.101-.2.05-.376-.025-.526-.075-.15-.676-1.63-.926-2.232-.244-.587-.492-.507-.676-.516l-.576-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508s1.078 2.909 1.228 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9-.119.58-.352 1.777-.726 2.028-1.428.251-.702.251-1.304.175-1.429-.075-.125-.276-.201-.577-.351M12.004 21.999c-1.789 0-3.541-.482-5.083-1.398l-.364-.216-3.784.992 1.01-3.689-.237-.377A9.972 9.972 0 012.02 12.001C2.02 6.495 6.497 2.018 12.004 2.018c2.668 0 5.176 1.039 7.06 2.923A9.923 9.923 0 0121.986 12c0 5.507-4.476 9.999-9.982 9.999M12.004.018C5.396.018.02 5.394.02 12.001a11.93 11.93 0 001.83 6.39L.014 24l5.772-1.514a11.96 11.96 0 006.218 1.724c6.608 0 11.984-5.376 11.984-11.983C23.988 5.394 18.612.018 12.004.018z" />
                  </svg>
                </Link>
              )}

              {/* Instagram */}
              {social.instagram && (
                <Link
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getSocialBtnClass("bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]")}
                  aria-label="Follow CouponKodee on Instagram"
                  title="Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
              )}

              {/* YouTube */}
              {social.youtube && (
                <Link
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getSocialBtnClass("bg-[#FF0000]")}
                  aria-label="Subscribe to CouponKodee on YouTube"
                  title="YouTube"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        )}

        </div>

        {/* Affiliate Disclosure Notice (if enabled) */}
        {disclosure?.showDisclosure && disclosure?.content && (
          <div className={`mt-12 pt-6 border-t ${themeConfig.divider}`}>
            <div className={`rounded-2xl p-4 sm:p-5 border text-xs space-y-1.5 leading-relaxed shadow-2xs ${themeConfig.disclosure}`}>
              <div className={`flex items-center gap-2 font-bold ${themeConfig.disclosureTitle}`}>
                <ShieldCheck className={`h-4 w-4 ${accentConfig.iconColor}`} />
                <span>{disclosure.title || "Affiliate Disclosure & Transparency Statement"}</span>
              </div>
              <p>
                {isCashbackEnabled
                  ? disclosure.content
                  : disclosure.content
                      .replace(/,\s*and cashback portal/gi, " and deals portal")
                      .replace(/and cashback/gi, "and discount")
                      .replace(
                        /We pass a major portion of this commission directly back to our users as Cashback\./gi,
                        "We pass the greatest savings directly back to our users through verified promo codes and discounts."
                      )
                      .replace(/Cashback/gi, "Discounts")
                      .replace(/cashback/gi, "discounts")}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Legal & Copyright Bar (Conditional) */}
        {showCopyrightBar && (
          <div className={`mt-8 pt-6 border-t ${themeConfig.divider} flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium ${themeConfig.legalMuted}`}>
            <p>{formattedCopyright}</p>
            <div className="flex items-center gap-4 flex-wrap">
              {copyright.bottomLinks.map((bLink, bIdx) => (
                <span key={bLink.label} className="inline-flex items-center gap-4">
                  <Link
                    href={bLink.url}
                    className={`${accentConfig.linkHover} transition-colors`}
                  >
                    {bLink.label}
                  </Link>
                  {bIdx < copyright.bottomLinks.length - 1 && <span>•</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE-ONLY FOOTER (< 640px) */}
      <div className="sm:hidden">
        {/* Short description at the top */}
        <div className="px-5 pt-7 pb-5 space-y-3">
          <BrandLogo
            brandName={brand.brandName}
            brandHighlight={brand.brandHighlight}
            customLogoUrl={brand.customLogoUrl}
            size="sm"
            tone={themePreset === "dark" ? "light" : "dark"}
          />

          <p className={`text-xs leading-relaxed ${themeConfig.subtext}`}>
            {isCashbackEnabled
              ? brand.bio
              : brand.bio
                  .replace(
                    /and real bank-transferable cashback from 500\+ top online stores\./gi,
                    "and exclusive discounts from 500+ top online stores."
                  )
                  .replace(/cashback/gi, "discounts")
                  .replace(/Cashback/gi, "Discounts")}
          </p>
        </div>

        {/* Accordion sections with divider lines */}
        <div className={`border-t ${themeConfig.divider}`}>
          {/* Section 1: Our Company */}
          <div className={`border-b ${themeConfig.divider}`}>
            <button
              type="button"
              onClick={() => toggleSection("company")}
              className="w-full flex items-center justify-between py-3.5 px-5 text-left transition-colors"
              aria-expanded={!!openSections["company"]}
            >
              <span className={`text-sm font-bold ${themeConfig.heading}`}>
                Our Company
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                  openSections["company"] ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections["company"] && (
              <ul className="space-y-2.5 pb-4 px-5">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.url}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                      className={`text-xs font-medium ${themeConfig.subtext} ${accentConfig.linkHover} transition-colors inline-block`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Section 2: Important Links */}
          <div className={`border-b ${themeConfig.divider}`}>
            <button
              type="button"
              onClick={() => toggleSection("important")}
              className="w-full flex items-center justify-between py-3.5 px-5 text-left transition-colors"
              aria-expanded={!!openSections["important"]}
            >
              <span className={`text-sm font-bold ${themeConfig.heading}`}>
                Important Links
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                  openSections["important"] ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections["important"] && (
              <ul className="space-y-2.5 pb-4 px-5">
                {importantLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.url}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                      className={`text-xs font-medium ${themeConfig.subtext} ${accentConfig.linkHover} transition-colors inline-block`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Section 3: Explore */}
          <div className={`border-b ${themeConfig.divider}`}>
            <button
              type="button"
              onClick={() => toggleSection("explore")}
              className="w-full flex items-center justify-between py-3.5 px-5 text-left transition-colors"
              aria-expanded={!!openSections["explore"]}
            >
              <span className={`text-sm font-bold ${themeConfig.heading}`}>
                Explore
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                  openSections["explore"] ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections["explore"] && (
              <ul className="space-y-2.5 pb-4 px-5">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.url}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                      className={`text-xs font-medium ${themeConfig.subtext} ${accentConfig.linkHover} transition-colors inline-block`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Section 4: Follow Us */}
          <div className={`border-b ${themeConfig.divider}`}>
            <button
              type="button"
              onClick={() => toggleSection("follow")}
              className="w-full flex items-center justify-between py-3.5 px-5 text-left transition-colors"
              aria-expanded={!!openSections["follow"]}
            >
              <span className={`text-sm font-bold ${themeConfig.heading}`}>
                Follow Us
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                  openSections["follow"] ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections["follow"] && (
              <div className="pb-4 px-5 space-y-3">
                <p className={`text-xs leading-relaxed ${themeConfig.muted}`}>
                  {isCashbackEnabled
                    ? "Stay updated with daily verified coupon drops & cashback alerts."
                    : "Stay updated with daily verified coupon drops & deal alerts."}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {/* Facebook */}
                  {social.facebook && (
                    <Link
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={getSocialBtnClass("bg-[#1877F2]")}
                      aria-label="Follow on Facebook"
                      title="Facebook"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </Link>
                  )}

                  {/* Twitter / X */}
                  {social.twitter && (
                    <Link
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={getSocialBtnClass("bg-slate-900")}
                      aria-label="Follow on Twitter / X"
                      title="Twitter / X"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </Link>
                  )}

                  {/* Pinterest */}
                  {social.pinterest && (
                    <Link
                      href={social.pinterest}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={getSocialBtnClass("bg-[#E60023]")}
                      aria-label="Follow on Pinterest"
                      title="Pinterest"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026l.032-.026z" />
                      </svg>
                    </Link>
                  )}

                  {/* WhatsApp */}
                  {social.whatsapp && (
                    <Link
                      href={social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={getSocialBtnClass("bg-[#25D366]")}
                      aria-label="Subscribe on WhatsApp"
                      title="WhatsApp"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.301-.15-1.777-.877-2.053-.977-.275-.101-.476-.15-.676.15-.2.301-.776.977-.951 1.177-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.674-2.083-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.101-.2.05-.376-.025-.526-.075-.15-.676-1.63-.926-2.232-.244-.587-.492-.507-.676-.516l-.576-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508s1.078 2.909 1.228 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9-.119.58-.352 1.777-.726 2.028-1.428.251-.702.251-1.304.175-1.429-.075-.125-.276-.201-.577-.351M12.004 21.999c-1.789 0-3.541-.482-5.083-1.398l-.364-.216-3.784.992 1.01-3.689-.237-.377A9.972 9.972 0 012.02 12.001C2.02 6.495 6.497 2.018 12.004 2.018c2.668 0 5.176 1.039 7.06 2.923A9.923 9.923 0 0121.986 12c0 5.507-4.476 9.999-9.982 9.999M12.004.018C5.396.018.02 5.394.02 12.001a11.93 11.93 0 001.83 6.39L.014 24l5.772-1.514a11.96 11.96 0 006.218 1.724c6.608 0 11.984-5.376 11.984-11.983C23.988 5.394 18.612.018 12.004.018z" />
                      </svg>
                    </Link>
                  )}

                  {/* Instagram */}
                  {social.instagram && (
                    <Link
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={getSocialBtnClass("bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]")}
                      aria-label="Follow on Instagram"
                      title="Instagram"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </Link>
                  )}

                  {/* YouTube */}
                  {social.youtube && (
                    <Link
                      href={social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={getSocialBtnClass("bg-[#FF0000]")}
                      aria-label="Subscribe on YouTube"
                      title="YouTube"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copyright section at the bottom */}
        <div className="px-5 py-5 text-center text-xs space-y-2.5">
          <p className={`font-medium ${themeConfig.legalMuted}`}>
            {formattedCopyright}
          </p>
          <div className={`flex items-center justify-center gap-3 flex-wrap ${themeConfig.legalMuted} text-2xs`}>
            {copyright.bottomLinks.map((bLink, bIdx) => (
              <span key={bLink.label} className="inline-flex items-center gap-3">
                <Link
                  href={bLink.url}
                  className={`${accentConfig.linkHover} transition-colors`}
                >
                  {bLink.label}
                </Link>
                {bIdx < copyright.bottomLinks.length - 1 && <span>•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Thin orange strip along the bottom edge */}
        <div className="h-1 bg-orange-500 w-full" />
      </div>
    </footer>
  )
}

