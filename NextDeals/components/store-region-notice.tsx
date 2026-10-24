"use client"

import Link from "@/components/localized-link"
import { Globe2, ArrowRight } from "lucide-react"
import { useCountry } from "@/components/country-context"
import { CountryFlag } from "@/components/country-flag"
import { COUNTRIES } from "@/lib/countries-data"

export interface RegionalStore {
  slug: string
  name: string
  countries: string[]
}

interface StoreRegionNoticeProps {
  storeName: string
  storeCountries: string[]
  /** Same brand in other regions, e.g. Amazon US / Amazon UK for Amazon India. */
  siblings: RegionalStore[]
}

/**
 * Shown when the shopper's region isn't one this store serves. Points them to the
 * same brand's store for their region when we have one, otherwise to their region's directory.
 */
export function StoreRegionNotice({ storeName, storeCountries, siblings }: StoreRegionNoticeProps) {
  const { country } = useCountry()

  if (country.code === "GLOBAL" || storeCountries.length === 0 || storeCountries.includes(country.code)) {
    return null
  }

  const localStore = siblings.find((s) => s.countries.includes(country.code))
  const servedRegions = storeCountries.map((code) => COUNTRIES.find((c) => c.code === code)?.name ?? code).join(", ")

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <CountryFlag code={country.code} size="md" />
        <p className="text-sm text-amber-950">
          <strong className="font-semibold">Shopping from {country.name}?</strong>{" "}
          These {storeName} offers are for shoppers in {servedRegions} and may not apply in your region.
        </p>
      </div>
      {localStore ? (
        <Link
          href={`/store/${localStore.slug}`}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-400"
        >
          See {localStore.name} offers <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <Link
          href="/stores"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-amber-950 ring-1 ring-amber-300 transition-colors hover:bg-amber-100"
        >
          <Globe2 className="h-4 w-4" /> Stores in {country.name}
        </Link>
      )}
    </div>
  )
}
