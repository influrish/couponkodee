"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { StoreOfferCard, OfferData } from "@/components/store-offer-card"
import { useCountry } from "@/components/country-context"
import { CountryFlag } from "@/components/country-flag"
import { COUNTRIES, isEntityInCountry } from "@/lib/countries-data"
import {
  ChevronRight,
  CircleDollarSign,
  Flame,
  Search,
  Tag,
  X,
} from "lucide-react"
import { useCashbackVisibility } from "@/components/cashback-context"
import { FilterDropdown, RegionFilterDropdown } from "@/components/filter-dropdown"

export interface DealOfferItem extends OfferData {
  merchantSlug: string
  category?: string
  countries?: string[]
}

interface DealsExplorerProps {
  initialOffers: DealOfferItem[]
  stores: Array<{
    name: string
    slug: string
    initial: string
    bg: string
    offersCount: number
    countries?: string[]
  }>
}

type DealTypeFilter = "all" | "coupon" | "deal" | "cashback"

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

const PAGE_SIZE = 16

export function DealsExplorer({ initialOffers, stores }: DealsExplorerProps) {
  const { country, setCountry } = useCountry()
  const isCashbackEnabled = useCashbackVisibility()
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<DealTypeFilter>("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStore, setSelectedStore] = useState("all")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Filter offers
  const filteredOffers = useMemo(() => {
    return initialOffers.filter((offer) => {
      // 0. Country Filter
      if (country.code !== "GLOBAL") {
        if (!isEntityInCountry(offer.countries, offer.merchantSlug, country.code)) {
          return false
        }
      }

      // Hide cashback offers globally if disabled
      if (!isCashbackEnabled && offer.type === "cashback") {
        return false
      }

      // 1. Text Search
      if (search.trim()) {
        const query = search.toLowerCase().trim()
        const matchTitle = offer.title.toLowerCase().includes(query)
        const matchMerchant = offer.merchant.toLowerCase().includes(query)
        const matchDesc = (offer.description || "").toLowerCase().includes(query)
        const matchCode = (offer.code || "").toLowerCase().includes(query)
        if (!matchTitle && !matchMerchant && !matchDesc && !matchCode) return false
      }

      // 2. Type Filter (Coupon, Deal, Cashback)
      if (selectedType !== "all") {
        if (selectedType === "coupon" && (!offer.code || offer.type !== "coupon")) return false
        if (selectedType === "deal" && offer.type !== "deal") return false
        if (selectedType === "cashback" && offer.type !== "cashback") return false
      }

      // 3. Category Filter
      if (selectedCategory !== "all" && offer.category !== selectedCategory) {
        return false
      }

      // 4. Store Filter
      if (selectedStore !== "all" && offer.merchantSlug !== selectedStore) {
        return false
      }

      return true
    })
  }, [initialOffers, country.code, search, selectedType, selectedCategory, selectedStore])

  const availableStores = useMemo(() => {
    if (country.code === "GLOBAL") return stores
    return stores.filter((s) => isEntityInCountry(s.countries, s.slug, country.code))
  }, [stores, country.code])

  const visibleOffers = filteredOffers.slice(0, visibleCount)
  const hasMore = visibleCount < filteredOffers.length

  const couponsCount = filteredOffers.filter((o) => o.code || o.type === "coupon").length
  const dealsCount = filteredOffers.filter((o) => o.type === "deal").length
  const cashbackCount = filteredOffers.filter((o) => o.type === "cashback").length

  const handleReset = () => {
    setSearch("")
    setSelectedType("all")
    setSelectedCategory("all")
    setSelectedStore("all")
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="space-y-6">
      {/* 1. Search Bar */}
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
            placeholder={`Search ${country.name} deals, coupons, stores (e.g. Amazon, 50% Off)...`}
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

      {/* 2. STANDARDIZED FILTER TOOLBAR (Region, Offer Type, Category, Store Selectors) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Selector */}
          <RegionFilterDropdown
            country={country}
            onSelectCountry={(c) => {
              setCountry(c)
              setSelectedStore("all")
              setVisibleCount(PAGE_SIZE)
            }}
          />

          {/* Type / Offer Type Selector */}
          <FilterDropdown
            prefix="Type:"
            currentValue={selectedType}
            defaultValue="all"
            options={[
              { value: "all", label: "All Offers", badge: initialOffers.length },
              {
                value: "coupon",
                label: "Coupons & Codes",
                badge: couponsCount,
                icon: <Tag className="h-3.5 w-3.5 text-purple-600" />,
              },
              {
                value: "deal",
                label: "Hot Deals",
                badge: dealsCount,
                icon: <Flame className="h-3.5 w-3.5 text-amber-500" />,
              },
              ...(isCashbackEnabled
                ? [
                    {
                      value: "cashback",
                      label: "Cashback",
                      badge: cashbackCount,
                      icon: <CircleDollarSign className="h-3.5 w-3.5 text-emerald-600" />,
                    },
                  ]
                : []),
            ]}
            onSelect={(val) => {
              setSelectedType(val as DealTypeFilter)
              setVisibleCount(PAGE_SIZE)
            }}
          />

          {/* Category Selector */}
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

          {/* Store Selector */}
          <FilterDropdown
            prefix="Store:"
            currentValue={selectedStore}
            defaultValue="all"
            searchable={true}
            searchPlaceholder="Search store..."
            options={[
              { value: "all", label: `All Stores (${availableStores.length})` },
              ...availableStores.map((s) => ({
                value: s.slug,
                label: s.name,
                badge: s.offersCount,
              })),
            ]}
            onSelect={(val) => {
              setSelectedStore(val)
              setVisibleCount(PAGE_SIZE)
            }}
          />

          {/* Clear / Reset Filters */}
          {(search || selectedType !== "all" || selectedCategory !== "all" || selectedStore !== "all") && (
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
          Showing <strong>{filteredOffers.length}</strong> {filteredOffers.length === 1 ? "offer" : "offers"}
        </span>
      </div>

      {/* 5. Offers Grid */}
      {filteredOffers.length > 0 ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {visibleOffers.map((offer) => (
              <StoreOfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-purple-300 hover:bg-purple-50 text-slate-800 hover:text-purple-700 font-bold text-xs shadow-sm transition-all"
              >
                <span>Load More Deals ({filteredOffers.length - visibleCount} remaining)</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-base font-extrabold text-slate-900">
            No offers found matching your filters
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search query, selecting &ldquo;All Offers&rdquo;, or resetting your filters.
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
