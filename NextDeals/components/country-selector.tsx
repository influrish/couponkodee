"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useCountry } from "@/components/country-context"
import { CountryFlag } from "@/components/country-flag"
import {
  Check,
  ChevronDown,
  Search,
} from "lucide-react"

interface CountrySelectorProps {
  compact?: boolean
  fullWidth?: boolean
  className?: string
}

export function CountrySelector({
  compact = false,
  fullWidth = false,
  className = "",
}: CountrySelectorProps) {
  const { country, countries, setCountry } = useCountry()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Filter countries by query
  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries
    const q = search.toLowerCase().trim()
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currencyCode.toLowerCase().includes(q) ||
        (c.nativeName && c.nativeName.toLowerCase().includes(q))
    )
  }, [countries, search])

  const handleSelect = (code: string) => {
    setCountry(code)
    setIsOpen(false)
    setSearch("")
  }

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""} ${className}`} ref={dropdownRef}>
      {/* Trigger: Full-Width Card (e.g. for Mobile Drawer) */}
      {fullWidth ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-purple-50/90 to-indigo-50/70 border border-purple-200/90 hover:border-purple-400 hover:shadow-xs transition-all text-left"
          title={`Current Region: ${country.name} (${country.code}) - Click to change`}
          aria-label="Select Country or Region"
        >
          <div className="flex items-center gap-3 min-w-0">
            <CountryFlag code={country.code} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-500">Region:</span>
                <span className="text-xs font-bold text-slate-900 truncate">
                  {country.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-200/80 text-xs font-bold text-purple-900 uppercase">
                  {country.code}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-purple-200 text-xs font-bold text-purple-700 shadow-xs">
            <span>Change</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
      ) : (
        /* Trigger: Desktop / Compact Header Pill Button */
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-purple-300 text-xs font-bold text-slate-800 shadow-xs transition-all ${
            compact ? "px-2.5 py-1.5" : "px-3.5 py-1.5"
          }`}
          title="Regions - Click to switch"
          aria-label="Select Country or Region"
        >
          <span>Regions</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-500 group-hover:text-purple-600 transition-transform ${
              isOpen ? "rotate-180 text-purple-600" : ""
            }`}
          />
        </button>
      )}

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute mt-2 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
            fullWidth
              ? "left-0 right-0 w-full"
              : "right-0 w-80 sm:w-96 max-w-[calc(100vw-2rem)]"
          }`}
        >
          {/* Search Box */}
          <div className="relative mb-2.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country, code (US, UK, IN)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-600 transition-all"
              autoFocus
            />
          </div>

          {/* Country List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredCountries.map((c) => {
              const isSelected = c.code === country.code
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-purple-50 border border-purple-200/90 text-purple-950 font-bold shadow-xs"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CountryFlag code={c.code} size="lg" />
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {c.name}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 uppercase">
                      {c.code}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 pl-2">
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-purple-700 text-white flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}

            {filteredCountries.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching countries found for &quot;{search}&quot;.
              </div>
            )}
          </div>

          {/* Footer Active Country Info */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>Active:</span>
              <CountryFlag code={country.code} size="sm" />
              <strong className="text-slate-900">{country.name} ({country.code})</strong>
            </div>
            <span className="font-bold text-emerald-700">{country.badge}</span>
          </div>
        </div>
      )}
    </div>
  )
}

