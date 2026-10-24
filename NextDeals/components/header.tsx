"use client"

import Link from "@/components/localized-link"
import {
  ChevronDown,
  CircleDollarSign,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
  Wallet,
  X,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { BrandLogo } from "@/components/brand-logo"
import { useCountry } from "@/components/country-context"
import { localizeHref } from "@/lib/regions"
import { useCashbackVisibility } from "@/components/cashback-context"
import { CountrySelector } from "@/components/country-selector"
import { HeaderData, defaultHeaderData } from "@/lib/cms-types"

interface HeaderProps {
  initialData?: HeaderData
  isCashbackEnabled?: boolean
}

export function Header({ initialData, isCashbackEnabled: propCashback }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { country, region } = useCountry()
  const searchAction = localizeHref("/deals", region)
  const contextCashback = useCashbackVisibility()
  const isCashbackEnabled = propCashback !== undefined ? propCashback : contextCashback
  const userMenuRef = useRef<HTMLDivElement>(null)

  const data = initialData || defaultHeaderData
  const brand = data.brand || defaultHeaderData.brand
  const announcement = data.announcement || defaultHeaderData.announcement
  const search = data.search || defaultHeaderData.search
  const rawMenuItems = data.menuItems && data.menuItems.length > 0 ? data.menuItems : defaultHeaderData.menuItems
  const menuItems = isCashbackEnabled
    ? rawMenuItems
    : rawMenuItems.filter(
        (item) => !item.isCashback && item.url !== "/cashback" && !/cashback/i.test(item.label)
      )
  const features = data.features || defaultHeaderData.features
  const appearance = data.appearance || defaultHeaderData.appearance || {}

  const navbarBg = appearance.navbarBg || "white"
  const customBgColor = appearance.customBgColor
  const accentColor = appearance.accentColor || "purple"
  const announcementBg = appearance.announcementBg || "purple-gradient"
  const customAnnouncementBg = appearance.customAnnouncementBg
  const customAnnouncementTextColor = appearance.customAnnouncementTextColor

  const announcementBgClasses = {
    "purple-gradient": "bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white",
    emerald: "bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white",
    amber: "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white",
    dark: "bg-slate-900 text-slate-100",
    custom: "text-white",
  }[announcementBg] || "bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white"

  const primaryRequiredLinks = [
    { label: "Home", url: "/" },
    { label: "Stores", url: "/stores" },
    { label: "Categories", url: "/categories" },
    { label: "Coupons", url: "/coupons" },
    { label: "Deals", url: "/deals" },
  ]
  const allNavItems = [...menuItems]
  for (const pl of primaryRequiredLinks) {
    if (!allNavItems.some((m) => m.url === pl.url || m.label.toLowerCase() === pl.label.toLowerCase())) {
      allNavItems.push(pl)
    }
  }

  const customAnnouncementStyle: React.CSSProperties = {}
  if (announcementBg === "custom") {
    if (customAnnouncementBg) customAnnouncementStyle.backgroundColor = customAnnouncementBg
    if (customAnnouncementTextColor) customAnnouncementStyle.color = customAnnouncementTextColor
  }

  const navbarBgClasses = {
    white: "bg-white/95 backdrop-blur-md border-b border-slate-200",
    slate: "bg-slate-50/95 backdrop-blur-md border-b border-slate-200",
    dark: "bg-slate-900/95 text-slate-100 backdrop-blur-md border-b border-slate-800",
    transparent: "bg-transparent backdrop-blur-sm border-b border-slate-200/50",
    custom: "backdrop-blur-md border-b border-slate-200/50",
  }[navbarBg] || "bg-white/95 backdrop-blur-md border-b border-slate-200"

  const customNavbarStyle: React.CSSProperties = {}
  if (navbarBg === "custom" && customBgColor) {
    customNavbarStyle.backgroundColor = customBgColor
  }

  const headerAccentConfig = {
    purple: {
      searchBtn: "bg-purple-700 hover:bg-purple-800",
      menuHover: "hover:text-purple-700 hover:bg-purple-50",
      searchRing: "focus:border-purple-600 focus:ring-purple-100",
      loginHover: "hover:text-purple-700",
      signupBtn: "bg-purple-700 hover:bg-purple-800 text-white shadow-purple-200",
    },
    emerald: {
      searchBtn: "bg-emerald-600 hover:bg-emerald-700",
      menuHover: "hover:text-emerald-700 hover:bg-emerald-50",
      searchRing: "focus:border-emerald-600 focus:ring-emerald-100",
      loginHover: "hover:text-emerald-700",
      signupBtn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200",
    },
    indigo: {
      searchBtn: "bg-indigo-600 hover:bg-indigo-700",
      menuHover: "hover:text-indigo-700 hover:bg-indigo-50",
      searchRing: "focus:border-indigo-600 focus:ring-indigo-100",
      loginHover: "hover:text-indigo-700",
      signupBtn: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200",
    },
    orange: {
      searchBtn: "bg-orange-600 hover:bg-orange-700",
      menuHover: "hover:text-orange-700 hover:bg-orange-50",
      searchRing: "focus:border-orange-600 focus:ring-orange-100",
      loginHover: "hover:text-orange-700",
      signupBtn: "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200",
    },
    blue: {
      searchBtn: "bg-blue-600 hover:bg-blue-700",
      menuHover: "hover:text-blue-700 hover:bg-blue-50",
      searchRing: "focus:border-blue-600 focus:ring-blue-100",
      loginHover: "hover:text-blue-700",
      signupBtn: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
    },
    custom: {
      searchBtn: "bg-slate-900 hover:bg-slate-800",
      menuHover: "hover:opacity-80",
      searchRing: "focus:border-slate-600 focus:ring-slate-100",
      loginHover: "hover:opacity-80",
      signupBtn: "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200",
    },
  }[accentColor] || {
    searchBtn: "bg-purple-700 hover:bg-purple-800",
    menuHover: "hover:text-purple-700 hover:bg-purple-50",
    searchRing: "focus:border-purple-600 focus:ring-purple-100",
    loginHover: "hover:text-purple-700",
    signupBtn: "bg-purple-700 hover:bg-purple-800 text-white shadow-purple-200",
  }

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const firstName = user?.name ? user.name.split(" ")[0] : "Member"

  return (
    <>
      {/* 0. Optional Top Announcement Bar (Configurable from Admin Panel) */}
      {announcement.enabled && announcement.text && (isCashbackEnabled || (!/cashback/i.test(announcement.text) && announcement.link !== "/cashback")) && (
        <aside
          aria-label="Announcement"
          className={`text-sm py-2 px-4 text-center font-bold border-b border-purple-900/20 shadow-xs relative z-50 ${announcementBgClasses}`}
          style={Object.keys(customAnnouncementStyle).length > 0 ? customAnnouncementStyle : undefined}
        >
          <div className="container flex items-center justify-center gap-2 flex-wrap">
            {announcement.badge && (
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs uppercase font-bold tracking-wider">
                {announcement.badge}
              </span>
            )}
            <span>{announcement.text}</span>
            {announcement.link && (
              <Link href={announcement.link} className="underline hover:text-amber-300 ml-1 transition-colors">
                Explore &rarr;
              </Link>
            )}
          </div>
        </aside>
      )}

      {/* Main Header */}
      <header
        className={`site-header sticky top-0 z-40 transition-colors ${navbarBgClasses}`}
        style={Object.keys(customNavbarStyle).length > 0 ? customNavbarStyle : undefined}
      >
        <div className="container">
          <div className="flex h-16 sm:h-[72px] items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            {/* Logo */}
            <BrandLogo
              brandName={brand.brandName}
              brandHighlight={brand.brandHighlight}
              customLogoUrl={brand.customLogoUrl}
              tone={navbarBg === "dark" ? "light" : "dark"}
            />


            {/* Header Search Bar (Desktop) */}
            {features.showSearch && (
              <div className="hidden lg:flex flex-1 max-w-sm xl:max-w-md mx-2">
                <form action={searchAction} method="GET" className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="q"
                    placeholder={search.placeholder || "Search 500+ stores, coupons or deals..."}
                    className="w-full text-ellipsis pl-10 pr-24 py-2 rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 text-sm text-slate-800 transition-all"
                  />
                  <button
                    type="submit"
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1 ${headerAccentConfig.searchBtn} text-white rounded-full text-sm font-semibold transition-colors`}
                  >
                    {search.buttonText || "Search"}
                  </button>
                </form>
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.url}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  className={`px-2.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 ${headerAccentConfig.menuHover} transition-all flex items-center gap-1.5`}
                >
                  {item.label}
                  {item.badge && (
                    <span
                      className={`rounded-full text-xs px-2 py-0.5 font-bold uppercase tracking-wider ${
                        item.isCashback
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions (Country, Auth & Mobile Toggle) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Country / Region Switcher */}
              {features.showCountrySelector && <CountrySelector />}

              {user ? (
                /* User is Logged In: Profile Menu */
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-sm font-semibold text-slate-800 shadow-xs"
                  >
                    <div className="h-7 w-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate max-w-[100px]">Hi, {firstName}</span>
                    {isCashbackEnabled && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Wallet className="h-3 w-3" />
                        ₹{user.walletBalance || 50}
                      </span>
                    )}
                    <ChevronDown className="h-3 w-3 text-slate-500" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        {isCashbackEnabled && (
                          <Link
                            href="/cashback"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-2 text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                          >
                            <span className="flex items-center gap-2">
                              <CircleDollarSign className="h-4 w-4 text-emerald-600" />
                              My Cashback Balance
                            </span>
                            <span className="font-bold text-emerald-600">₹{user.walletBalance || 50}</span>
                          </Link>
                        )}

                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50/50 hover:bg-purple-100"
                          >
                            <Settings className="h-4 w-4 text-purple-600" />
                            Admin Panel
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            logout()
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* User is Logged Out: Auth Buttons */
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className={`px-3 py-1.5 text-sm font-semibold text-slate-700 ${headerAccentConfig.loginHover} transition-colors`}
                  >
                    {features.loginLabel || "Sign In"}
                  </Link>
                  <Link
                    href="/signup"
                    className={`px-3.5 py-1.5 rounded-full ${headerAccentConfig.signupBtn} text-sm font-semibold shadow-sm transition-all hover:shadow`}
                  >
                    {features.signupLabel || "Join Free"}
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
            {/* Mobile Search */}
            {features.showSearch && (
              <form action={searchAction} method="GET" className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  name="q"
                  placeholder={search.placeholder || "Search 500+ stores, coupons or deals..."}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-purple-600"
                />
              </form>
            )}

            {/* Mobile Nav Links: Home, Stores, Categories, Coupons, Deals, Cashback */}
            <div className="grid grid-cols-2 gap-2">
              {allNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.url}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-sm font-bold text-slate-700 hover:text-purple-700"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        item.isCashback
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-slate-100">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs font-medium text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    {isCashbackEnabled && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ₹{user.walletBalance || 50}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 text-center py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false)
                        logout()
                      }}
                      className="flex-1 text-center py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700"
                  >
                    {features.loginLabel || "Sign In"}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl bg-purple-700 text-white text-sm font-bold"
                  >
                    {features.signupLabel || "Join Free"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
