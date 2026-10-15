import type React from "react"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-context"
import { CountryProvider } from "@/components/country-context"
import { CashbackProvider } from "@/components/cashback-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getHeaderData, getFooterData, getCashbackVisibility } from "@/lib/cms-settings"

export const dynamic = "force-dynamic"

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [headerData, footerData, isCashbackEnabled] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getCashbackVisibility(),
  ])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CashbackProvider enabled={isCashbackEnabled}>
            <CountryProvider>
              <AuthProvider>
                <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans overflow-x-clip w-full">
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