export interface CountryInfo {
  code: string
  name: string
  nativeName?: string
  flag: string
  currency: string
  currencyCode: string
  locale: string
  storesCount: number
  couponsCount: number
  badge: string
  popularStores: string[]
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: "IN",
    name: "India",
    nativeName: "भारत",
    flag: "🇮🇳",
    currency: "₹",
    currencyCode: "INR",
    locale: "en-IN",
    storesCount: 32,
    couponsCount: 320,
    badge: "₹500+ Cr Saved",
    popularStores: [
      "MakeMyTrip",
      "JioMart",
      "Tata CLiQ",
      "Netmeds",
      "Urban Company",
      "H&M",
      "Amazon India",
      "Flipkart",
      "Myntra",
      "Swiggy",
      "Zomato",
      "Tata 1mg",
      "Nykaa",
      "boAt",
      "Blinkit",
      "Zepto",
      "Ajio",
      "Croma",
      "Samsung",
      "Puma",
      "Lenskart",
      "Domino's",
    ],
  },
  {
    code: "US",
    name: "United States",
    nativeName: "USA",
    flag: "🇺🇸",
    currency: "$",
    currencyCode: "USD",
    locale: "en-US",
    storesCount: 28,
    couponsCount: 260,
    badge: "$25M+ Saved",
    popularStores: [
      "Amazon US",
      "Walmart",
      "Target",
      "Best Buy",
      "Apple",
      "Nike",
      "Costco",
      "eBay",
      "Sephora",
      "Samsung",
      "Dell",
      "HP",
      "Puma",
      "Uber",
      "Booking.com",
      "Airbnb",
      "IKEA",
      "H&M",
    ],
  },
  {
    code: "UK",
    name: "United Kingdom",
    nativeName: "Britain",
    flag: "🇬🇧",
    currency: "£",
    currencyCode: "GBP",
    locale: "en-GB",
    storesCount: 22,
    couponsCount: 190,
    badge: "£18M+ Saved",
    popularStores: [
      "Amazon UK",
      "ASOS",
      "Currys",
      "Argos",
      "Boots",
      "Marks & Spencer",
      "Apple",
      "Nike",
      "Sephora",
      "Samsung",
      "IKEA",
      "Uber",
      "Booking.com",
      "Puma",
      "H&M",
      "eBay",
    ],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    nativeName: "الإمارات",
    flag: "🇦🇪",
    currency: "AED",
    currencyCode: "AED",
    locale: "en-AE",
    storesCount: 18,
    couponsCount: 150,
    badge: "50M+ AED Saved",
    popularStores: [
      "Amazon UAE",
      "Noon",
      "Namshi",
      "Carrefour UAE",
      "Sharaf DG",
      "Sivvi",
      "Apple",
      "Nike",
      "Sephora",
      "Samsung",
      "IKEA",
      "Booking.com",
      "Uber",
      "Puma",
      "H&M",
    ],
  },
  {
    code: "CA",
    name: "Canada",
    nativeName: "Canada",
    flag: "🇨🇦",
    currency: "C$",
    currencyCode: "CAD",
    locale: "en-CA",
    storesCount: 16,
    couponsCount: 130,
    badge: "C$12M+ Saved",
    popularStores: [
      "Amazon Canada",
      "Walmart CA",
      "Best Buy CA",
      "Canadian Tire",
      "Lululemon",
      "Hudson's Bay",
      "Costco CA",
      "Sephora CA",
      "Apple",
      "Nike",
      "Samsung",
      "eBay",
      "Uber",
      "Booking.com",
      "Puma",
      "IKEA",
    ],
  },
  {
    code: "AU",
    name: "Australia",
    nativeName: "Australia",
    flag: "🇦🇺",
    currency: "A$",
    currencyCode: "AUD",
    locale: "en-AU",
    storesCount: 15,
    couponsCount: 120,
    badge: "A$14M+ Saved",
    popularStores: [
      "Amazon Australia",
      "Woolworths",
      "JB Hi-Fi",
      "The Iconic",
      "Apple",
      "Nike",
      "Sephora",
      "Samsung",
      "eBay",
      "Uber",
      "Booking.com",
      "Puma",
      "IKEA",
      "H&M",
      "Airbnb",
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    nativeName: "Singapore",
    flag: "🇸🇬",
    currency: "S$",
    currencyCode: "SGD",
    locale: "en-SG",
    storesCount: 14,
    couponsCount: 110,
    badge: "S$8M+ Saved",
    popularStores: [
      "Shopee SG",
      "Lazada SG",
      "Amazon Singapore",
      "Grab",
      "Apple",
      "Nike",
      "Sephora",
      "Samsung",
      "Booking.com",
      "Zalando",
      "Uber",
      "IKEA",
      "Puma",
      "H&M",
    ],
  },
  {
    code: "DE",
    name: "Germany / EU",
    nativeName: "Deutschland",
    flag: "🇩🇪",
    currency: "€",
    currencyCode: "EUR",
    locale: "de-DE",
    storesCount: 14,
    couponsCount: 105,
    badge: "€10M+ Saved",
    popularStores: [
      "Amazon DE",
      "Zalando",
      "MediaMarkt",
      "Otto",
      "Apple",
      "Nike",
      "Sephora",
      "Samsung",
      "IKEA",
      "Booking.com",
      "Puma",
      "H&M",
      "eBay",
      "Uber",
      "Airbnb",
    ],
  },
  {
    code: "GLOBAL",
    name: "All Regions (Global)",
    nativeName: "Worldwide",
    flag: "🌐",
    currency: "$",
    currencyCode: "USD",
    locale: "en-US",
    storesCount: 65,
    couponsCount: 850,
    badge: "Global Savings",
    popularStores: [
      "Amazon",
      "AliExpress",
      "eBay",
      "Booking.com",
      "Nike",
      "Apple",
      "Samsung",
      "Airbnb",
      "Uber",
      "Sephora",
      "Walmart",
      "IKEA",
      "ASOS",
      "Puma",
      "H&M",
      "Dell",
      "HP",
      "Zalando",
    ],
  },
]

export const DEFAULT_COUNTRY = COUNTRIES[0] // India (IN)

export function getCountryByCode(codeOrObj?: string | CountryInfo | null): CountryInfo {
  if (!codeOrObj) return DEFAULT_COUNTRY
  const code = typeof codeOrObj === "string" ? codeOrObj : codeOrObj?.code
  if (!code) return DEFAULT_COUNTRY
  const upper = String(code).toUpperCase().trim()
  const found = COUNTRIES.find((c) => c.code === upper)
  return found || DEFAULT_COUNTRY
}

/**
 * Determine which countries a store operates in.
 * Enables accurate regional coupon & store filtering.
 */
export function getStoreCountries(slug?: string): string[] {
  if (!slug) return ["IN"]
  const s = slug.toLowerCase().trim()

  // Truly worldwide platforms
  if (["booking", "aliexpress", "airbnb", "uber"].includes(s)) {
    return ["IN", "US", "UK", "AE", "CA", "AU", "SG", "DE"]
  }

  // Canada Stores
  if (
    [
      "amazon-ca",
      "walmart-ca",
      "bestbuy-ca",
      "canadian-tire",
      "lululemon",
      "hudsons-bay",
      "costco-ca",
      "sephora-ca",
      "nike-ca",
      "apple-ca",
      "sportchek",
      "indigo-ca",
    ].includes(s)
  ) {
    return ["CA"]
  }

  // US Stores
  if (
    [
      "amazon-us",
      "walmart",
      "target",
      "bestbuy",
      "ebay",
      "nike",
      "nike-us",
      "sephora",
      "macys",
      "apple-us",
      "homedepot",
      "costco",
      "gap",
      "nordstrom",
    ].includes(s)
  ) {
    return ["US"]
  }

  // UK Stores
  if (
    [
      "amazon-uk",
      "asos",
      "currys",
      "argos",
      "boots",
      "tesco",
      "marks-spencer",
      "jdsports",
      "sainsburys",
      "very",
    ].includes(s)
  ) {
    return ["UK"]
  }

  // UAE / Middle East Stores
  if (
    [
      "amazon-ae",
      "noon",
      "namshi",
      "carrefour-ae",
      "sharaf-dg",
      "sivvi",
      "emirates",
      "talabat",
      "mumzworld",
    ].includes(s)
  ) {
    return ["AE"]
  }

  // Australia Stores
  if (
    [
      "amazon-au",
      "woolworths",
      "coles",
      "jbhifi",
      "theiconic",
      "kogan",
      "catch",
      "myer",
    ].includes(s)
  ) {
    return ["AU"]
  }

  // Singapore Stores
  if (
    [
      "amazon-sg",
      "shopee-sg",
      "lazada-sg",
      "grab-sg",
      "grab",
      "zalora-sg",
      "qoo10-sg",
      "qoo10",
    ].includes(s)
  ) {
    return ["SG"]
  }

  // Germany / EU Stores
  if (
    [
      "amazon-de",
      "zalando",
      "mediamarkt",
      "otto",
      "douglas",
      "lidl",
      "saturn",
    ].includes(s)
  ) {
    return ["DE"]
  }

  // Default: Indian store (Dell India, Puma India, Amazon IN, Flipkart, Myntra, Swiggy, etc.)
  return ["IN"]
}

/**
 * Check if a store or offer is valid in the selected region.
 */
export function isEntityInCountry(
  entityCountries: string[] | undefined,
  storeSlug: string | undefined,
  selectedCountryCode: string
): boolean {
  if (!selectedCountryCode || selectedCountryCode === "GLOBAL") return true
  const countries =
    entityCountries && entityCountries.length > 0
      ? entityCountries
      : getStoreCountries(storeSlug)

  return countries.includes(selectedCountryCode)
}

