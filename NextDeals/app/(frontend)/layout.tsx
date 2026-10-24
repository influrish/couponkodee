import type React from "react"
import type { Metadata, Viewport } from "next"
// Self-hosted variable font: no runtime request to Google, works offline, and
// unicode-range subsets (incl. latin-ext for ₹) load only when a page needs them.
import "@fontsource-variable/plus-jakarta-sans/wght.css"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-context"
import { CountryProvider } from "@/components/country-context"
import { CashbackProvider } from "@/components/cashback-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getHeaderData, getFooterData, getCashbackVisibility } from "@/lib/cms-settings"
import { headers } from "next/headers"
import { COUNTRIES } from "@/lib/countries-data"
import { DEFAULT_REGION, FALLBACK_REGION, regionToCountryCode } from "@/lib/regions"

export const dynamic = "force-dynamic"

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  colorScheme: "light",
}

/** Region and region-less path for this request, set by middleware.ts. */
async function getRequestRegion() {
  const h = await headers()
  return { region: h.get("x-region") || DEFAULT_REGION, path: h.get("x-pathname") || "/" }
}

/** Content language tag for a country: the copy is English everywhere (UK uses ISO "GB"). */
function contentLanguage(countryCode: string) {
  if (countryCode === "GLOBAL") return "en"
  return `en-${countryCode === "UK" ? "GB" : countryCode}`
}

function regionUrl(region: string, path: string) {
  return `/${region}${path === "/" ? "" : path}`
}

export async function generateMetadata(): Promise<Metadata> {
  const { region, path } = await getRequestRegion()

  // One URL per region; hreflang tells search engines which to show in each country.
  const languages: Record<string, string> = Object.fromEntries(
    COUNTRIES.filter((c) => c.code !== "GLOBAL").map((c) => [contentLanguage(c.code), regionUrl(c.code.toLowerCase(), path)])
  )
  languages["x-default"] = regionUrl(FALLBACK_REGION, path)

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: "CouponKodee | Verified Coupons, Deals & Cashback",
    description: "Save on every order with verified coupon codes, trending deals and cashback from top Indian and global stores.",
    alternates: { canonical: regionUrl(region, path), languages },
    icons: { icon: [{ url: "/brand-mark.svg", type: "image/svg+xml" }] },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [headerData, footerData, isCashbackEnabled] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getCashbackVisibility(),
  ])
  const { region } = await getRequestRegion()
  const countryCode = regionToCountryCode(region)
  const locale = contentLanguage(countryCode)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {/* The storefront is designed light-only; following the OS theme rendered dark text on dark cards. */}
        <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
          <CashbackProvider enabled={isCashbackEnabled}>
            <CountryProvider initialCode={countryCode}>
              <AuthProvider>
                <div className="min-h-screen flex flex-col overflow-x-clip w-full">
                  <Header initialData={headerData} isCashbackEnabled={isCashbackEnabled} />
                  <main className="flex-1 w-full overflow-x-clip">{children}</main>
                  <Footer initialData={footerData} isCashbackEnabled={isCashbackEnabled} />
                </div>
              </AuthProvider>
            </CountryProvider>
          </CashbackProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}