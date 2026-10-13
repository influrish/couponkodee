export const CATEGORY_IMAGES: Record<string, string> = {
  fashion: "/categories/fashion.png",
  "fashion-apparel": "/categories/fashion.png",
  electronics: "/categories/electronics.png",
  "mobiles-electronics": "/categories/electronics.png",
  appliances: "/categories/electronics.png",
  departmental: "/categories/electronics.png",
  food: "/categories/food.png",
  "food-dining": "/categories/food.png",
  travel: "/categories/travel.png",
  "travel-flights": "/categories/travel.png",
  beauty: "/categories/beauty.png",
  "health-beauty": "/categories/beauty.png",
  "beauty-wellness": "/categories/beauty.png",
  "beauty-grooming": "/categories/beauty.png",
  home: "/categories/home.png",
  "home-garden": "/categories/home.png",
  "home-kitchen": "/categories/home.png",
  "home-living": "/categories/home.png",
  grocery: "/categories/grocery.png",
  "food-grocery": "/categories/grocery.png",
  "grocery-essentials": "/categories/grocery.png",
  "grocery-daily": "/categories/grocery.png",
  cashback: "/categories/cashback.png",
  deals: "/categories/cashback.png",
}

export function getCategoryImageUrl(slug?: string, name?: string): string {
  const s = (slug || "").toLowerCase().trim()
  if (CATEGORY_IMAGES[s]) return CATEGORY_IMAGES[s]

  const n = (name || "").toLowerCase().trim()
  if (n.includes("beauty") || n.includes("grooming") || n.includes("cosmetic") || n.includes("wellness")) {
    return "/categories/beauty.png"
  }
  if (n.includes("fashion") || n.includes("apparel") || n.includes("cloth") || n.includes("wear")) {
    return "/categories/fashion.png"
  }
  if (
    n.includes("electr") ||
    n.includes("appliance") ||
    n.includes("departmental") ||
    n.includes("gadget") ||
    n.includes("mobile") ||
    n.includes("phone")
  ) {
    return "/categories/electronics.png"
  }
  if (n.includes("home") || n.includes("kitchen") || n.includes("living") || n.includes("garden") || n.includes("furniture")) {
    return "/categories/home.png"
  }
  if (n.includes("grocer") || n.includes("essential") || n.includes("daily") || n.includes("supermarket") || n.includes("staple")) {
    return "/categories/grocery.png"
  }
  if (n.includes("travel") || n.includes("flight") || n.includes("hotel") || n.includes("tour") || n.includes("trip")) {
    return "/categories/travel.png"
  }
  if (n.includes("food") || n.includes("dining") || n.includes("restaurant") || n.includes("pizza") || n.includes("meal")) {
    return "/categories/food.png"
  }
  if (n.includes("cashback") || n.includes("deal") || n.includes("discount") || n.includes("offer")) {
    return "/categories/cashback.png"
  }

  return "/categories/fashion.png"
}

