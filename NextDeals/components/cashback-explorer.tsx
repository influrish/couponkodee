"use client"

import { useState, useMemo } from "react"
import Link from "@/components/localized-link"
import { StoreItem } from "@/lib/stores-data"
import { getBrandLogo } from "@/lib/brand-logos"
import { useCountry } from "@/components/country-context"
import { CountryFlag } from "@/components/country-flag"
import { COUNTRIES, isEntityInCountry } from "@/lib/countries-data"
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  Globe,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react"

interface CashbackExplorerProps {
  stores: StoreItem[]
}

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "fashion", label: "Fashion" },
  { id: "electronics", label: "Electronics" },
  { id: "food", label: "Food & Dining" },
  { id: "travel", label: "Travel" },
  { id: "beauty", label: "Beauty & Wellness" },
  { id: "home", label: "Home & Living" },
  { id: "grocery", label: "Grocery" },
]

export function CashbackExplorer({ stores }: CashbackExplorerProps) {
  const { country, setCountry } = useCountry()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({})

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      // 0. Country Filter
      if (country.code !== "GLOBAL") {
        if (!isEntityInCountry(store.countries, store.slug, country.code)) {
          return false
        }
      }

      if (search.trim()) {
        const query = search.toLowerCase().trim()
        const matchName = store.name.toLowerCase().includes(query)
        const matchCat = store.categoryName.toLowerCase().includes(query)
        const matchRate = (store.cashbackRate || "").toLowerCase().includes(query)
        if (!matchName && !matchCat && !matchRate) return false
      }

      if (selectedCategory !== "all" && store.category !== selectedCategory) {
        return false
      }

      return true
    })
  }, [stores, country.code, search, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${country.name} stores with cashback (e.g. Amazon, Myntra, Swiggy)...`}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-300 bg-white text-sm text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3.5 p-1 rounded-full text-slate-500 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Country / Region Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar justify-start sm:justify-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1.5 flex items-center gap-1">
          <Globe className="h-3.5 w-3.5 text-emerald-600" /> Country / Region:
        </span>
        {COUNTRIES.map((c) => {
          const isSelected = country.code === c.code
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => setCountry(c)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50"
              }`}
            >
              <CountryFlag code={c.code} size="sm" />
              <span>{c.name}</span>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {c.code}
              </span>
            </button>
          )
        })}
      </div>

      {/* Regional Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-xs text-emerald-950">
        <div className="flex items-center gap-2 font-medium">
          <CountryFlag code={country.code} size="md" />
          <span>
            Active Region: <strong>{country.name} ({country.code})</strong> &bull; Currency: <strong>{country.currency} {country.currencyCode}</strong>
          </span>
        </div>
        {country.code !== "GLOBAL" ? (
          <button
            type="button"
            onClick={() => setCountry(COUNTRIES.find((c) => c.code === "GLOBAL")!)}
            className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
          >
            Switch to All Regions (Global)
          </button>
        ) : (
          <span className="text-slate-500 text-xs">Displaying cashback offers across all supported regions</span>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar justify-start sm:justify-center">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50"
              }`}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-200">
        <span>
          Showing <strong>{filteredStores.length}</strong> stores offering real bank cashback
        </span>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("")
              setSelectedCategory("all")
            }}
            className="text-emerald-700 font-bold hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Cashback Store Cards Grid */}
      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredStores.map((store) => {
            const redirectUrl = `/out?url=${encodeURIComponent(
              store.affiliateUrl
            )}&merchant=${encodeURIComponent(store.slug)}`

            const isFailed = failedLogos[store.slug]
            const logo = !isFailed ? (store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name)) : null
            return (
              <article
                key={store.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div>
                  {/* Top Bar: Logo, Name, Badge */}
                  <div className="flex items-start gap-3 mb-3">
                    <Link
                      href={`/store/${store.slug}`}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105 ${
                        logo ? "bg-white border border-slate-100 p-1" : store.bg
                      }`}
                    >
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logo}
                          alt={store.name}
                          className="h-full w-full object-contain"
                          onError={() => setFailedLogos((prev) => ({ ...prev, [store.slug]: true }))}
                        />
                      ) : (
                        <span className="text-lg font-extrabold text-white">{store.initial}</span>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/store/${store.slug}`}
                          className="font-extrabold text-md text-slate-900 group-hover:text-emerald-700 transition-colors truncate"
                        >
                          {store.name}
                        </Link>
                        {store.isVerified && (
                          <span title="Verified Merchant" className="inline-flex items-center">
                            <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs font-semibold text-slate-500 truncate">
                          {store.categoryName}
                        </span>
                        {(() => {
                          const storeCountries = store.countries || ["IN"]
                          const displayCode = country.code !== "GLOBAL" ? country.code : (storeCountries.find((c) => c !== "GLOBAL") || "GLOBAL")
                          const cInfo = COUNTRIES.find((c) => c.code === displayCode) || country
                          if (!cInfo) return null
                          return (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                              <CountryFlag code={cInfo.code} size="sm" />
                              <span>{cInfo.name}</span>
                            </span>
                          )
                        })()}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 shrink-0">
                      <Zap className="h-3 w-3 text-emerald-600" /> Active
                    </span>
                  </div>

                  {/* Cashback Rate Pill */}
                  <div className="my-3 rounded-xl bg-emerald-50/80 border border-emerald-100 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-emerald-950">
                        {store.cashbackRate || "Earn Cashback"}
                      </span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Real Cash
                    </span>
                  </div>

                  {/* Description / Terms */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {store.cashbackTerms || store.description}
                  </p>
                </div>

                {/* CTAs */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/store/${store.slug}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                  >
                    View Offers
                  </Link>

                  <a
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm hover:shadow transition-all"
                  >
                    <span>Activate</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-base font-extrabold text-slate-900">
            No cashback stores found for &ldquo;{search}&rdquo;
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for another store or clear your selected category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("")
              setSelectedCategory("all")
            }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
