"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { COUNTRIES, CountryInfo, DEFAULT_COUNTRY, getCountryByCode } from "@/lib/countries-data"
import { REGION_COOKIE, countryCodeToRegion, localizeHref, splitRegion } from "@/lib/regions"

interface CountryContextType {
  country: CountryInfo
  /** URL prefix for the active country, e.g. "in" or "us". */
  region: string
  countries: CountryInfo[]
  setCountry: (codeOrCountry: string | CountryInfo) => void
  formatPrice: (amount: number) => string
}

const CountryContext = createContext<CountryContextType>({
  country: DEFAULT_COUNTRY,
  region: countryCodeToRegion(DEFAULT_COUNTRY.code),
  countries: COUNTRIES,
  setCountry: () => {},
  formatPrice: (val) => `₹${val}`,
})

const STORAGE_KEY = "couponkodee_country"

function persist(code: string) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
    document.cookie = `${REGION_COOKIE}=${code}; path=/; max-age=31536000; SameSite=Lax`
  } catch {
    // storage unavailable; the URL still carries the region
  }
}

/**
 * The URL prefix (/in, /us, ...) is the source of truth for the active country.
 * `initialCode` comes from the middleware so the first render already matches the URL.
 */
export function CountryProvider({ initialCode, children }: { initialCode?: string; children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [country, setCountryState] = useState<CountryInfo>(() => getCountryByCode(initialCode || DEFAULT_COUNTRY.code))

  // Follow client-side navigations between regions (back/forward, region links)
  useEffect(() => {
    const { region } = splitRegion(pathname || "/")
    if (!region) return
    const next = getCountryByCode(region.toUpperCase())
    setCountryState((current) => (current.code === next.code ? current : next))
    persist(next.code)
  }, [pathname])

  const setCountry = useCallback(
    (codeOrCountry: string | CountryInfo) => {
      const next = getCountryByCode(codeOrCountry)
      setCountryState(next)
      persist(next.code)

      // Swap the region prefix on the current page: /in/stores?x=1 -> /us/stores?x=1
      const { path } = splitRegion(window.location.pathname)
      router.push(localizeHref(`${path}${window.location.search}`, countryCodeToRegion(next.code)), { scroll: false })
    },
    [router]
  )

  const formatPrice = useCallback(
    (amount: number) => {
      if (country.code === "IN") {
        return `₹${amount.toLocaleString("en-IN")}`
      }
      return `${country.currency}${amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`
    },
    [country]
  )

  return (
    <CountryContext.Provider
      value={{ country, region: countryCodeToRegion(country.code), countries: COUNTRIES, setCountry, formatPrice }}
    >
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  return useContext(CountryContext)
}
