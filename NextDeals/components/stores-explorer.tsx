"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { StoreItem } from "@/lib/stores-data"
import { getBrandLogo } from "@/lib/brand-logos"
import { useCountry } from "@/components/country-context"
import { CountryFlag } from "@/components/country-flag"
import { COUNTRIES, isEntityInCountry } from "@/lib/countries-data"
import { FilterDropdown, RegionFilterDropdown } from "@/components/filter-dropdown"
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  Flame,
  Globe,
  Search,
  Tag,
  X,
  Zap,
} from "lucide-react"
import { useCashbackVisibility } from "@/components/cashback-context"

interface StoresExplorerProps {
  stores: StoreItem[]
}

const ALPHABETS = [
  "All",
  "0-9",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
]

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

type FilterType = "all" | "popular" | "cashback" | "coupons"

const PAGE_SIZE = 24

export function StoresExplorer({ stores }: StoresExplorerProps) {
  const { country, setCountry } = useCountry()
  const isCashbackEnabled = useCashbackVisibility()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [selectedLetter, setSelectedLetter] = useState("All")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({})

  // Filter logic
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      // 0. Country Filter
      if (country.code !== "GLOBAL") {
        if (!isEntityInCountry(store.countries, store.slug, country.code)) {
          return false
        }
      }

      // 1. Text Search
      if (search.trim()) {
        const query = search.toLowerCase().trim()
        const matchesName = store.name.toLowerCase().includes(query)
        const matchesCat = store.categoryName.toLowerCase().includes(query)
        const matchesDesc = store.description.toLowerCase().includes(query)
        if (!matchesName && !matchesCat && !matchesDesc) return false
      }

      // 2. Category Filter
      if (selectedCategory !== "all" && store.category !== selectedCategory) {
        return false
      }

      // 3. Status Filters (Popular, Cashback, Coupons)
      if (activeFilter === "popular" && !store.isPopular) return false
      if (activeFilter === "cashback" && (!store.hasCashback || !store.cashbackRate)) return false
      if (activeFilter === "coupons" && !store.hasCoupons) return false

      // 4. Alphabet Filter
      if (selectedLetter !== "All") {
        if (selectedLetter === "0-9") {
          const isNum = /^[0-9]/.test(store.initial || store.name)
          if (!isNum) return false
        } else {
          if (store.initial.toUpperCase() !== selectedLetter) {
            return false
          }
        }
      }

      return true
    })
  }, [stores, country.code, search, selectedCategory, activeFilter, selectedLetter])

  const visibleStores = filteredStores.slice(0, visibleCount)
  const hasMore = visibleCount < filteredStores.length

  const handleReset = () => {
    setSearch("")
    setSelectedCategory("all")
    setActiveFilter("all")
    setSelectedLetter("All")
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="space-y-6">
      {/* 1. STORE SEARCH BAR */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
            placeholder={`Search ${country.name} stores (e.g. Amazon, Myntra, Swiggy)...`}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-300 bg-white text-sm text-slate-900 shadow-sm focus:border-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. STANDARDIZED FILTER TOOLBAR (Region, Category, Type, Alphabet Selectors) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Selector */}
          <RegionFilterDropdown
            country={country}
            onSelectCountry={(c) => {
              setCountry(c)
              setVisibleCount(PAGE_SIZE)
            }}
          />

          {/* Categories Selector */}
          <FilterDropdown
            prefix="Category:"
            currentValue={selectedCategory}
            defaultValue="all"
            options={CATEGORIES.map((cat) => ({ value: cat.id, label: cat.label }))}
            onSelect={(val) => {
              setSelectedCategory(val)
              setVisibleCount(PAGE_SIZE)
            }}
          />

          {/* Type / Status Selector */}
          <FilterDropdown
            prefix="Filter:"
            currentValue={activeFilter}
            defaultValue="all"
            options={[
              { value: "all", label: "All Stores" },
              { value: "popular", label: "Popular", icon: <Flame className="h-3.5 w-3.5 text-amber-500" /> },
              ...(isCashbackEnabled
                ? [{ value: "cashback", label: "Cashback", icon: <CircleDollarSign className="h-3.5 w-3.5 text-emerald-600" /> }]
                : []),
              { value: "coupons", label: "Coupons", icon: <Tag className="h-3.5 w-3.5 text-purple-600" /> },
            ]}
            onSelect={(val) => {
              setActiveFilter(val as FilterType)
              setVisibleCount(PAGE_SIZE)
            }}
          />

          {/* Alphabetical Selector */}
          <FilterDropdown
            prefix="A–Z:"
            currentValue={selectedLetter}
            defaultValue="All"
            gridCols={6}
            options={ALPHABETS.map((letter) => ({ value: letter, label: letter }))}
            onSelect={(val) => {
              setSelectedLetter(val)
              setVisibleCount(PAGE_SIZE)
            }}
          />

          {/* Clear / Reset Filters */}
          {(search || selectedCategory !== "all" || activeFilter !== "all" || selectedLetter !== "All") && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-all border border-dashed border-slate-300 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <span className="text-xs font-bold text-slate-600">
          Showing <strong>{filteredStores.length}</strong> {filteredStores.length === 1 ? "store" : "stores"}
        </span>
      </div>

      {/* 5. STORE GRID */}
      {filteredStores.length > 0 ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {visibleStores.map((store) => {
              const directStoreUrl = `/out?url=${encodeURIComponent(
                store.affiliateUrl
              )}&merchant=${encodeURIComponent(store.slug)}`

              return (
                <div
                  key={store.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  {/* MOBILE LAYOUT (< 640px) */}
                  <div className="sm:hidden flex flex-col items-center justify-between text-center w-full gap-2 py-1">
                    {/* Top: Full brand name with verified badge */}
                    <Link
                      href={`/store/${store.slug}`}
                      className="flex items-center justify-center gap-1.5 w-full"
                    >
                      <span className="font-extrabold text-[15px] text-slate-900 group-hover:text-purple-700 transition-colors text-center leading-snug break-words">
                        {store.name}
                      </span>
                      <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    </Link>

                    {/* Below: Brand logo */}
                    {(() => {
                      const isFailed = failedLogos[store.slug]
                      const logo = !isFailed ? (store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name)) : null
                      return (
                        <Link
                          href={`/store/${store.slug}`}
                          className={`h-[52px] w-[52px] rounded-xl overflow-hidden shadow-2xs flex items-center justify-center my-0.5 ${
                            logo ? "bg-white border border-slate-200/80 p-1" : store.bg
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
                            <span className="font-black text-white text-base">{store.initial}</span>
                          )}
                        </Link>
                      )
                    })()}

                    {/* Below the logo: Offers count, such as "2 Offers" */}
                    <Link
                      href={`/store/${store.slug}`}
                      className="text-xs font-semibold text-slate-500 whitespace-nowrap hover:text-purple-700 transition-colors"
                    >
                      2 Offers
                    </Link>
                  </div>

                  {/* DESKTOP / TABLET LAYOUT (>= 640px) UNCHANGED */}
                  <div className="hidden sm:flex flex-col justify-between h-full">
                    <div>
                      {/* Top: Store Logo, Name, Verified */}
                      <div className="flex items-start gap-3 mb-3">
                        {(() => {
                          const isFailed = failedLogos[store.slug]
                          const logo = !isFailed ? (store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name)) : null
                          return (
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
                                <span className="text-lg font-black text-white">{store.initial}</span>
                              )}
                            </Link>
                          )
                        })()}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/store/${store.slug}`}
                              className="font-black text-[15px] text-slate-900 group-hover:text-purple-700 transition-colors truncate"
                            >
                              {store.name}
                            </Link>
                            <span title="Verified Store" className="inline-flex items-center">
                              <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                            </span>
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
                      </div>

                      {/* Stats: Live Coupons & Cashback Rate */}
                      <div className="space-y-1.5 my-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-semibold">Offers:</span>
                          <span className="font-bold text-purple-700 whitespace-nowrap">
                            {(() => {
                              const count = store.offers ? store.offers.length : (store.couponsCount ?? 0)
                              return `${count} ${count === 1 ? "active offer" : "active offers"}`
                            })()}
                          </span>
                        </div>

                        {isCashbackEnabled && store.cashbackRate ? (
                          <div className="flex items-center justify-between text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                            <span className="text-emerald-900 font-semibold flex items-center gap-1">
                              <CircleDollarSign className="h-3 w-3 text-emerald-600" />
                              Cashback:
                            </span>
                            <span className="font-black text-emerald-800">
                              {store.cashbackRate}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2 py-1">
                            <span>Coupons &amp; Deals</span>
                            <span>Verified</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {store.description}
                      </p>
                    </div>

                    {/* CTAs: "View Deals" & "Shop Now" */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/store/${store.slug}`}
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs transition-colors"
                      >
                        View Deals
                      </Link>

                      <a
                        href={directStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all"
                        title={`Visit ${store.name} website`}
                      >
                        <span>Shop Now</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 6. LOAD MORE / PAGINATION */}
          {hasMore && (
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-purple-300 hover:bg-purple-50 text-slate-800 hover:text-purple-700 font-bold text-xs shadow-sm transition-all"
              >
                <span>Load More Stores ({filteredStores.length - visibleCount} remaining)</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-base font-extrabold text-slate-900">
            No stores found matching your selection
          </p>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Try searching with another keyword or reset all filters to browse all 500+ verified partner stores.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  )
}

