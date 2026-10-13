"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { CountryFlag } from "@/components/country-flag"
import { COUNTRIES, Country } from "@/lib/countries-data"

export interface FilterDropdownOption {
  value: string
  label: string
  badge?: string | number
  icon?: React.ReactNode
}

interface FilterDropdownProps {
  prefix?: string
  label?: string
  currentValue: string
  defaultValue?: string
  options: FilterDropdownOption[]
  onSelect: (value: string) => void
  searchable?: boolean
  searchPlaceholder?: string
  className?: string
  align?: "left" | "right"
  gridCols?: number
}

/**
 * Standardized Filter Dropdown matching the top Region Selector's
 * interaction pattern, rounded pill styling, animations, and active states.
 */
export function FilterDropdown({
  prefix,
  label,
  currentValue,
  defaultValue = "all",
  options,
  onSelect,
  searchable = false,
  searchPlaceholder = "Search...",
  className = "",
  align = "left",
  gridCols,
}: FilterDropdownProps) {
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

  // Filter options by search query
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase().trim()
    return options.filter(
      (opt) => opt.label.toLowerCase().includes(q) || String(opt.value).toLowerCase().includes(q)
    )
  }, [options, search])

  const selectedOption = options.find((opt) => opt.value === currentValue) || options[0]
  const isDefault = currentValue === defaultValue

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button: Rounded pill styled identically to Region Selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group inline-flex items-center gap-1.5 rounded-full border text-xs font-bold shadow-xs transition-all px-3.5 py-1.5 cursor-pointer ${
          !isDefault
            ? "border-purple-300 bg-purple-50 text-purple-900 ring-2 ring-purple-100"
            : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-purple-300"
        }`}
        aria-expanded={isOpen}
      >
        {prefix && <span className="text-slate-400 font-semibold">{prefix}</span>}
        {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
        <span className="truncate max-w-[130px] sm:max-w-[180px]">
          {selectedOption ? selectedOption.label : label || currentValue}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 group-hover:text-purple-600 transition-transform shrink-0 ${
            isOpen ? "rotate-180 text-purple-600" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute mt-2 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-w-[calc(100vw-2rem)] ${
            align === "right" ? "right-0" : "left-0"
          } ${gridCols ? "w-64 sm:w-72" : "min-w-[190px] sm:min-w-[220px]"}`}
        >
          {searchable && (
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-600 transition-all"
                autoFocus
              />
            </div>
          )}

          {gridCols ? (
            <div
              className="grid gap-1 p-1 max-h-60 overflow-y-auto scrollbar-thin"
              style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
            >
              {filteredOptions.map((opt) => {
                const isSelected = opt.value === currentValue
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSelect(opt.value)
                      setIsOpen(false)
                      setSearch("")
                    }}
                    className={`h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? "bg-purple-700 text-white shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {filteredOptions.map((opt) => {
                const isSelected = opt.value === currentValue
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSelect(opt.value)
                      setIsOpen(false)
                      setSearch("")
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-50 border border-purple-200/90 text-purple-950 font-black shadow-xs"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {opt.label}
                      </span>
                      {opt.badge !== undefined && (
                        <span className="inline-flex px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                )
              })}

              {filteredOptions.length === 0 && (
                <div className="p-3 text-center text-xs text-slate-400">
                  No matching options
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Standardized Region Filter Dropdown for page-level filter toolbars,
 * identical in visual structure to the top Region Selector.
 */
export function RegionFilterDropdown({
  country,
  onSelectCountry,
  className = "",
}: {
  country: Country
  onSelectCountry: (c: Country) => void
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group inline-flex items-center gap-1.5 rounded-full border text-xs font-bold shadow-xs transition-all px-3.5 py-1.5 cursor-pointer ${
          country.code !== "GLOBAL"
            ? "border-purple-300 bg-purple-50 text-purple-900 ring-2 ring-purple-100"
            : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-purple-300"
        }`}
        aria-expanded={isOpen}
      >
        <span className="text-slate-400 font-semibold">Region:</span>
        <CountryFlag code={country.code} size="sm" />
        <span className="truncate max-w-[130px] sm:max-w-[180px]">{country.name}</span>
        <span className="px-1.5 py-0.5 rounded bg-purple-100 text-[10px] font-black text-purple-800 uppercase">
          {country.code}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 group-hover:text-purple-600 transition-transform shrink-0 ${
            isOpen ? "rotate-180 text-purple-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 w-72 sm:w-80 max-w-[calc(100vw-2rem)]">
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {COUNTRIES.map((c) => {
              const isSelected = c.code === country.code
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onSelectCountry(c)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-50 border border-purple-200/90 text-purple-950 font-black shadow-xs"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CountryFlag code={c.code} size="lg" />
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {c.name}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-black text-slate-700 uppercase">
                      {c.code}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0 ml-2">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

