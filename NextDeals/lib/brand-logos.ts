/**
 * Centralized Brand Logo Resolution Helper for CouponKodee
 * Maps any store name, merchant name, or slug variation to its high-res vector logo.
 */

export const KNOWN_LOGOS = new Set([
  // Core Indian Stores
  "tata-1mg", "2gud", "amazon", "ajio", "acer", "boat", "blinkit", "croma", "cleartrip",
  "dominos", "dell", "flipkart", "ferns-n-petals", "hm", "hp", "ikea", "jiomart", "kfc",
  "lenskart", "myntra", "makemytrip", "nykaa", "netmeds", "pepperfry", "puma", "swiggy",
  "samsung", "savana", "tata-cliq", "urban-company", "zomato", "zepto",

  // International & Regional Stores
  "walmart", "target", "bestbuy", "nike", "apple", "costco", "sephora",
  "canadian-tire", "lululemon", "hudsons-bay", "ebay", "asos", "currys",
  "boots", "argos", "marks-spencer", "woolworths", "jbhifi", "theiconic",
  "lazada", "grab", "shopee", "mediamarkt", "otto", "zalando", "noon",
  "namshi", "sharaf-dg", "sivvi", "carrefour", "booking", "airbnb",
  "aliexpress", "uber",

  // Exact Regional Slugs (to guarantee instant match)
  "walmart-ca", "bestbuy-ca", "costco-ca", "sephora-ca",
  "amazon-ca", "amazon-au", "amazon-sg", "amazon-de", "amazon-uk", "amazon-ae", "amazon-us",
  "lazada-sg", "grab-sg", "shopee-sg", "carrefour-ae", "apple-us",
])

const SLUG_ALIASES: Record<string, string> = {
  // Amazon Variations
  "amazon": "amazon",
  "amazon-india": "amazon",
  "amazon-in": "amazon",
  "amazon-ca": "amazon",
  "amazon-canada": "amazon",
  "amazon-us": "amazon",
  "amazon-uk": "amazon",
  "amazon-au": "amazon",
  "amazon-australia": "amazon",
  "amazon-sg": "amazon",
  "amazon-singapore": "amazon",
  "amazon-de": "amazon",
  "amazon-germany": "amazon",
  "amazon-ae": "amazon",
  "amazon-uae": "amazon",
  "amazon-prime": "amazon",

  // Walmart
  "walmart": "walmart",
  "walmart-ca": "walmart",
  "walmart-canada": "walmart",
  "walmart-us": "walmart",
  "walmart-usa": "walmart",

  // Best Buy
  "bestbuy": "bestbuy",
  "best-buy": "bestbuy",
  "bestbuy-ca": "bestbuy",
  "best-buy-ca": "bestbuy",
  "best-buy-canada": "bestbuy",
  "bestbuy-us": "bestbuy",

  // Target
  "target": "target",
  "target-us": "target",
  "target-stores": "target",

  // Apple
  "apple": "apple",
  "apple-us": "apple",
  "apple-store": "apple",

  // Costco
  "costco": "costco",
  "costco-ca": "costco",
  "costco-wholesale": "costco",
  "costco-canada": "costco",

  // Sephora
  "sephora": "sephora",
  "sephora-ca": "sephora",
  "sephora-canada": "sephora",

  // Canadian Retailers
  "canadian-tire": "canadian-tire",
  "canadiantire": "canadian-tire",
  "lululemon": "lululemon",
  "lululemon-athletica": "lululemon",
  "hudsons-bay": "hudsons-bay",
  "the-bay": "hudsons-bay",
  "hudson-bay": "hudsons-bay",

  // UK Retailers
  "asos": "asos",
  "currys": "currys",
  "currys-pc-world": "currys",
  "boots": "boots",
  "boots-uk": "boots",
  "argos": "argos",
  "argos-uk": "argos",
  "marks-spencer": "marks-spencer",
  "marks-and-spencer": "marks-spencer",
  "m-and-s": "marks-spencer",
  "mns": "marks-spencer",

  // Australia Retailers
  "woolworths": "woolworths",
  "woolies": "woolworths",
  "jbhifi": "jbhifi",
  "jb-hifi": "jbhifi",
  "theiconic": "theiconic",
  "the-iconic": "theiconic",

  // Southeast Asia Retailers
  "lazada": "lazada",
  "lazada-sg": "lazada",
  "grab": "grab",
  "grab-sg": "grab",
  "grabfood": "grab",
  "shopee": "shopee",
  "shopee-sg": "shopee",

  // Europe / Germany Retailers
  "mediamarkt": "mediamarkt",
  "media-markt": "mediamarkt",
  "otto": "otto",
  "otto-de": "otto",
  "zalando": "zalando",
  "zalando-de": "zalando",

  // Middle East / UAE Retailers
  "noon": "noon",
  "noon-ae": "noon",
  "namshi": "namshi",
  "sharaf-dg": "sharaf-dg",
  "sharafdg": "sharaf-dg",
  "sivvi": "sivvi",
  "carrefour": "carrefour",
  "carrefour-ae": "carrefour",

  // Global Platforms
  "booking": "booking",
  "booking-com": "booking",
  "airbnb": "airbnb",
  "aliexpress": "aliexpress",
  "uber": "uber",
  "uber-eats": "uber",
  "ebay": "ebay",
  "nike": "nike",

  // Puma
  "puma": "puma",
  "puma-india": "puma",
  "pumaindia": "puma",

  // boAt
  "boat": "boat",
  "boat-lifestyle": "boat",
  "boatlifestyle": "boat",

  // Domino's
  "dominos": "dominos",
  "domino-s": "dominos",
  "domino-s-pizza": "dominos",
  "dominos-pizza": "dominos",
  "dominospizza": "dominos",
  "domino": "dominos",

  // Dell
  "dell": "dell",
  "dell-india": "dell",
  "dellindia": "dell",

  // HP
  "hp": "hp",
  "hp-online-store": "hp",
  "hponlinestore": "hp",
  "hp-store": "hp",

  // H&M
  "hm": "hm",
  "h-m": "hm",
  "h-and-m": "hm",
  "handm": "hm",

  // Tata
  "tata-1mg": "tata-1mg",
  "tata1mg": "tata-1mg",
  "1mg": "tata-1mg",
  "tata-cliq": "tata-cliq",
  "tatacliq": "tata-cliq",

  // Ferns N Petals
  "ferns-n-petals": "ferns-n-petals",
  "fernsnpetals": "ferns-n-petals",
  "ferns-and-petals": "ferns-n-petals",
  "fnp": "ferns-n-petals",

  // Urban Company
  "urban-company": "urban-company",
  "urbancompany": "urban-company",
  "urban-clap": "urban-company",
  "urbanclap": "urban-company",

  // MakeMyTrip
  "makemytrip": "makemytrip",
  "make-my-trip": "makemytrip",
  "mmt": "makemytrip",

  // Savana
  "savana": "savana",
  "savana-by-urbanic": "savana",

  // E-commerce & Food
  "flipkart": "flipkart",
  "myntra": "myntra",
  "ajio": "ajio",
  "nykaa": "nykaa",
  "swiggy": "swiggy",
  "zomato": "zomato",
  "blinkit": "blinkit",
  "zepto": "zepto",
  "jiomart": "jiomart",
  "kfc": "kfc",
  "croma": "croma",
  "samsung": "samsung",
  "cleartrip": "cleartrip",
  "ikea": "ikea",
  "lenskart": "lenskart",
  "netmeds": "netmeds",
  "pepperfry": "pepperfry",
  "acer": "acer",
  "2gud": "2gud",
}

const CUSTOM_BRAND_LOGOS: Record<string, string> = {
  lenskart: "/logos/lenskart.jpg",
  ajio: "/logos/ajio.jpg",
  nykaa: "/logos/nykaa.jpg",
  dominos: "/logos/dominos.jpg",
  croma: "/logos/croma.jpg",
}

/**
 * Returns the public URL of the brand logo for any merchant/store identifier.
 */
export function getBrandLogo(identifier?: string | null): string | null {
  if (!identifier) return null

  // If already a valid relative or absolute URL to an existing image
  if (identifier.startsWith("/logos/") || identifier.startsWith("http://") || identifier.startsWith("https://")) {
    return identifier
  }

  // 1. Direct normalization (strip special characters, convert spaces & punctuation to hyphens)
  const normalized = identifier
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "") // Strip apostrophes first ("Domino's" -> "dominos")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

  if (CUSTOM_BRAND_LOGOS[normalized]) {
    return CUSTOM_BRAND_LOGOS[normalized]
  }

  if (KNOWN_LOGOS.has(normalized)) {
    return `/logos/${normalized}.svg`
  }

  if (SLUG_ALIASES[normalized]) {
    return `/logos/${SLUG_ALIASES[normalized]}.svg`
  }

  // 2. Alphanumeric only key
  const alphaNumeric = identifier.toLowerCase().replace(/[^a-z0-9]/g, "")
  if (CUSTOM_BRAND_LOGOS[alphaNumeric]) {
    return CUSTOM_BRAND_LOGOS[alphaNumeric]
  }

  if (KNOWN_LOGOS.has(alphaNumeric)) {
    return `/logos/${alphaNumeric}.svg`
  }

  if (SLUG_ALIASES[alphaNumeric]) {
    return `/logos/${SLUG_ALIASES[alphaNumeric]}.svg`
  }

  // 3. Fallback Heuristics for common brand substrings
  if (alphaNumeric.includes("walmart")) return "/logos/walmart.svg"
  if (alphaNumeric.includes("target")) return "/logos/target.svg"
  if (alphaNumeric.includes("bestbuy") || alphaNumeric.includes("best-buy")) return "/logos/bestbuy.svg"
  if (alphaNumeric.includes("canadiantire") || alphaNumeric.includes("canadian-tire")) return "/logos/canadian-tire.svg"
  if (alphaNumeric.includes("lululemon")) return "/logos/lululemon.svg"
  if (alphaNumeric.includes("hudson") || alphaNumeric.includes("hudsonsbay")) return "/logos/hudsons-bay.svg"
  if (alphaNumeric.includes("costco")) return "/logos/costco.svg"
  if (alphaNumeric.includes("sephora")) return "/logos/sephora.svg"
  if (alphaNumeric.includes("woolworth")) return "/logos/woolworths.svg"
  if (alphaNumeric.includes("jbhifi")) return "/logos/jbhifi.svg"
  if (alphaNumeric.includes("iconic")) return "/logos/theiconic.svg"
  if (alphaNumeric.includes("lazada")) return "/logos/lazada.svg"
  if (alphaNumeric.includes("grab")) return "/logos/grab.svg"
  if (alphaNumeric.includes("shopee")) return "/logos/shopee.svg"
  if (alphaNumeric.includes("mediamarkt")) return "/logos/mediamarkt.svg"
  if (alphaNumeric.includes("otto")) return "/logos/otto.svg"
  if (alphaNumeric.includes("zalando")) return "/logos/zalando.svg"
  if (alphaNumeric.includes("noon")) return "/logos/noon.svg"
  if (alphaNumeric.includes("namshi")) return "/logos/namshi.svg"
  if (alphaNumeric.includes("sharafdg")) return "/logos/sharaf-dg.svg"
  if (alphaNumeric.includes("sivvi")) return "/logos/sivvi.svg"
  if (alphaNumeric.includes("carrefour")) return "/logos/carrefour.svg"
  if (alphaNumeric.includes("booking")) return "/logos/booking.svg"
  if (alphaNumeric.includes("airbnb")) return "/logos/airbnb.svg"
  if (alphaNumeric.includes("aliexpress")) return "/logos/aliexpress.svg"
  if (alphaNumeric.includes("uber")) return "/logos/uber.svg"
  if (alphaNumeric.includes("apple")) return "/logos/apple.svg"
  if (alphaNumeric.includes("nike")) return "/logos/nike.svg"
  if (alphaNumeric.includes("ebay")) return "/logos/ebay.svg"
  if (alphaNumeric.includes("asos")) return "/logos/asos.svg"
  if (alphaNumeric.includes("currys")) return "/logos/currys.svg"
  if (alphaNumeric.includes("boots")) return "/logos/boots.svg"
  if (alphaNumeric.includes("argos")) return "/logos/argos.svg"
  if (alphaNumeric.includes("marks") || alphaNumeric.includes("spencer")) return "/logos/marks-spencer.svg"
  if (alphaNumeric.includes("puma")) return "/logos/puma.svg"
  if (alphaNumeric.includes("boat")) return "/logos/boat.svg"
  if (alphaNumeric.includes("domino")) return "/logos/dominos.svg"
  if (alphaNumeric.includes("1mg")) return "/logos/tata-1mg.svg"
  if (alphaNumeric.includes("cliq")) return "/logos/tata-cliq.svg"
  if (alphaNumeric.includes("ferns") || alphaNumeric.includes("fnp")) return "/logos/ferns-n-petals.svg"
  if (alphaNumeric.includes("makemytrip") || alphaNumeric === "mmt") return "/logos/makemytrip.svg"
  if (alphaNumeric.includes("urban") && (alphaNumeric.includes("company") || alphaNumeric.includes("clap"))) return "/logos/urban-company.svg"
  if (alphaNumeric.includes("dell")) return "/logos/dell.svg"
  if (alphaNumeric.includes("croma")) return "/logos/croma.svg"
  if (alphaNumeric.includes("savana")) return "/logos/savana.svg"
  if (alphaNumeric.includes("zepto")) return "/logos/zepto.svg"
  if (alphaNumeric.includes("blinkit")) return "/logos/blinkit.svg"
  if (alphaNumeric.includes("lenskart")) return "/logos/lenskart.svg"
  if (alphaNumeric.includes("netmeds")) return "/logos/netmeds.svg"
  if (alphaNumeric.includes("pepperfry")) return "/logos/pepperfry.svg"
  if (alphaNumeric.includes("cleartrip")) return "/logos/cleartrip.svg"
  if (alphaNumeric.includes("jiomart")) return "/logos/jiomart.svg"
  if (alphaNumeric.includes("zomato")) return "/logos/zomato.svg"
  if (alphaNumeric.includes("swiggy")) return "/logos/swiggy.svg"
  if (alphaNumeric.includes("myntra")) return "/logos/myntra.svg"
  if (alphaNumeric.includes("flipkart")) return "/logos/flipkart.svg"
  if (alphaNumeric.includes("amazon")) return "/logos/amazon.svg"
  if (alphaNumeric.includes("samsung")) return "/logos/samsung.svg"
  if (alphaNumeric.includes("ajio")) return "/logos/ajio.svg"
  if (alphaNumeric.includes("nykaa")) return "/logos/nykaa.svg"
  if (alphaNumeric.includes("ikea")) return "/logos/ikea.svg"
  if (alphaNumeric.includes("acer")) return "/logos/acer.svg"
  if (alphaNumeric.includes("kfc")) return "/logos/kfc.svg"
  if (alphaNumeric.includes("2gud")) return "/logos/2gud.svg"
  if (alphaNumeric.includes("hm") || alphaNumeric.includes("handm")) return "/logos/hm.svg"
  if (alphaNumeric.includes("hp")) return "/logos/hp.svg"

  return null
}

