"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { COUNTRIES, CountryInfo, DEFAULT_COUNTRY, getCountryByCode } from "@/lib/countries-data"

interface CountryContextType {
  country: CountryInfo
  countries: CountryInfo[]
  setCountry: (codeOrCountry: string | CountryInfo) => void
  formatPrice: (amount: number) => string
}

const CountryContext = createContext<CountryContextType>({
  country: DEFAULT_COUNTRY,
  countries: COUNTRIES,
  setCountry: () => {},
  formatPrice: (val) => `₹${val}`,
})

const STORAGE_KEY = "couponkodee_country"
const COOKIE_KEY = "couponkodee_country"

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<CountryInfo>(DEFAULT_COUNTRY)

  // 1. Initial hydration from localStorage and/or cookie
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setCountryState(getCountryByCode(stored))
        return
      }

      // Check cookie
      const match = document.cookie.match(new RegExp("(^| )" + COOKIE_KEY + "=([^;]+)"))
      if (match && match[2]) {
        setCountryState(getCountryByCode(match[2]))
      }
    } catch {
      // ignore storage access errors
    }
  }, [])

  // 2. Set Country
  const setCountry = useCallback((codeOrCountry: string | CountryInfo) => {
    const next = getCountryByCode(codeOrCountry)
    setCountryState(next)

    try {
      localStorage.setItem(STORAGE_KEY, next.code)
      document.cookie = `${COOKIE_KEY}=${next.code}; path=/; max-age=31536000; SameSite=Lax`
    } catch {
      // ignore storage quota errors
    }
  }, [])

  // 3. Format Currency
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
    <CountryContext.Provider value={{ country, countries: COUNTRIES, setCountry, formatPrice }}>
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  return useContext(CountryContext)
}

