"use client"

import { useState, useMemo } from "react"
import { StoreOfferCard, OfferData } from "@/components/store-offer-card"
import { useCashbackVisibility } from "@/components/cashback-context"
import {
  BadgeCheck,
  Check,
  CircleDollarSign,
  Layers,
  Flame,
  Search,
  Tag,
  X,
} from "lucide-react"

interface StoreOffersViewProps {
  storeName: string
  offers: Array<{
    id: string
    title: string
    description?: string
    code?: string
    discount: string
    type: "coupon" | "deal" | "cashback"
    affiliateUrl: string
    isVerified: boolean
  }>
}

type TabType = "all" | "coupon" | "deal" | "cashback"

export function StoreOffersView({ storeName, offers }: StoreOffersViewProps) {
  const isCashbackEnabled = useCashbackVisibility()
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [search, setSearch] = useState("")
  const [onlyVerified, setOnlyVerified] = useState(false)

  const visibleBaseOffers = useMemo(() => {
    if (isCashbackEnabled) return offers
    return offers.filter(
      (o) => o.type !== "cashback" && !/cashback/i.test(o.title) && !/cashback/i.test(o.discount)
    )
  }, [offers, isCashbackEnabled])

  const isCouponOffer = (o: StoreOffersViewProps["offers"][0]) =>
    o.type === "coupon" || Boolean(o.code)

  const isCashbackOffer = (o: StoreOffersViewProps["offers"][0]) =>
    o.type === "cashback" || (o.discount && o.discount.toLowerCase().includes("cashback"))

  const isDealOffer = (o: StoreOffersViewProps["offers"][0]) =>
    o.type === "deal" || (!o.code && !isCashbackOffer(o))

  const couponsCount = useMemo(
    () => visibleBaseOffers.filter(isCouponOffer).length,
    [visibleBaseOffers]
  )
  const dealsCount = useMemo(
    () => visibleBaseOffers.filter(isDealOffer).length,
    [visibleBaseOffers]
  )
  const cashbackCount = useMemo(
    () => (isCashbackEnabled ? visibleBaseOffers.filter(isCashbackOffer).length : 0),
    [visibleBaseOffers, isCashbackEnabled]
  )

  const filteredOffers = useMemo(() => {
    return visibleBaseOffers.filter((o) => {
      // 1. Text Search inside store offers
      if (search.trim()) {
        const query = search.toLowerCase().trim()
        const matchTitle = (o.title || "").toLowerCase().includes(query)
        const matchDesc = (o.description || "").toLowerCase().includes(query)
        const matchCode = (o.code || "").toLowerCase().includes(query)
        const matchDisc = (o.discount || "").toLowerCase().includes(query)
        if (!matchTitle && !matchDesc && !matchCode && !matchDisc) return false
      }

      // 2. Tab Filter
      if (activeTab === "coupon" && !isCouponOffer(o)) return false
      if (activeTab === "deal" && !isDealOffer(o)) return false
      if (activeTab === "cashback" && !isCashbackOffer(o)) return false

      // 3. Verified Only Filter
      if (onlyVerified && !o.isVerified) return false

      return true
    })
  }, [visibleBaseOffers, activeTab, search, onlyVerified])

  const handleReset = () => {
    setActiveTab("all")
    setSearch("")
    setOnlyVerified(false)
  }

  return (
    <div className="space-y-5">
      {/* 1. In-Store Search & Verified Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${storeName} offers (e.g. 50% off, code, app)...`}
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-600 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOnlyVerified(!onlyVerified)}
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
            onlyVerified
              ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <BadgeCheck className={`h-4 w-4 ${onlyVerified ? "text-emerald-600" : "text-slate-400"}`} />
          <span>Verified Only</span>
        </button>
      </div>

      {/* 2. Offer Type Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-purple-700 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-purple-50"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All Offers ({visibleBaseOffers.length})</span>
          </button>

          {couponsCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("coupon")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "coupon"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-purple-50"
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              <span>Coupons &amp; Codes ({couponsCount})</span>
            </button>
          )}

          {dealsCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("deal")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "deal"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-purple-50"
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Hot Deals ({dealsCount})</span>
            </button>
          )}

          {cashbackCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("cashback")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "cashback"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50"
              }`}
            >
              <CircleDollarSign className="h-3.5 w-3.5" />
              <span>Cashback ({cashbackCount})</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>
            Showing <strong>{filteredOffers.length}</strong> {filteredOffers.length === 1 ? "offer" : "offers"}
          </span>
          {(search || activeTab !== "all" || onlyVerified) && (
            <button
              type="button"
              onClick={handleReset}
              className="text-purple-700 hover:underline font-bold ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 3. Offers Grid */}
      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4">
          {filteredOffers.map((offer) => {
            const cardOffer: OfferData = {
              id: offer.id,
              title: offer.title,
              description: offer.description,
              merchant: storeName,
              code: offer.code,
              discount: offer.discount,
              type: offer.type,
              affiliateUrl: offer.affiliateUrl,
              isVerified: offer.isVerified,
            }

            return <StoreOfferCard key={offer.id} offer={cardOffer} />
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center bg-white shadow-xs">
          <p className="text-base font-black text-slate-900">
            No matching offers found
          </p>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            {isCashbackEnabled
              ? "Try adjusting your search keywords or switching between the Coupons, Deals, or Cashback tabs."
              : "Try adjusting your search keywords or switching between the Coupons or Deals tabs."}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all"
          >
            Show All {storeName} Offers
          </button>
        </div>
      )}
    </div>
  )
}

