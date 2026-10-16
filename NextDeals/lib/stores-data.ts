import { getBrandLogo } from "@/lib/brand-logos"
import { getStoreCountries } from "@/lib/countries-data"

export interface StoreOffer {
  id: string
  title: string
  description?: string
  code?: string
  discount: string
  type: "coupon" | "deal" | "cashback"
  affiliateUrl: string
  expiresAt?: string
  isVerified: boolean
  countries?: string[]
}

export interface StoreItem {
  id: string
  name: string
  slug: string
  category: "fashion" | "electronics" | "food" | "travel" | "beauty" | "home" | "grocery"
  categoryName: string
  initial: string
  couponsCount: number
  cashbackRate: string | null
  cashbackTerms?: string
  isPopular: boolean
  hasCashback: boolean
  hasCoupons: boolean
  isVerified: boolean
  affiliateUrl: string
  bg: string
  description: string
  offers?: StoreOffer[]
  logoUrl?: string
  countries?: string[]
}

export const initialStores: StoreItem[] = [
  // Numbers / 0-9
  {
    id: "1mg",
    name: "Tata 1mg",
    slug: "tata-1mg",
    category: "beauty",
    categoryName: "Beauty & Wellness",
    initial: "1",
    couponsCount: 19,
    cashbackRate: "Up to 6.0% Cashback",
    cashbackTerms: "Cashback is paid on prescription medicines, OTC products and health checkups.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.1mg.com/",
    bg: "bg-amber-600",
    description: "Prescription medicines, lab tests, vitamins and personal wellness care.",
    offers: [
      { id: "1mg-1", title: "Flat 20% Off on Prescription Medicines", description: "Save on verified prescription medicines with free home delivery.", code: "CARE20", discount: "20% OFF", type: "coupon", affiliateUrl: "https://www.1mg.com/", isVerified: true },
      { id: "1mg-2", title: "Up to 50% Off on Health Checkup Packages", description: "Comprehensive full body checkup with free sample collection.", discount: "50% OFF", type: "deal", affiliateUrl: "https://www.1mg.com/", isVerified: true },
    ],
  },
  {
    id: "2gud",
    name: "2GUD",
    slug: "2gud",
    category: "electronics",
    categoryName: "Electronics",
    initial: "2",
    couponsCount: 11,
    cashbackRate: "Up to 4.0% Cashback",
    cashbackTerms: "Applicable on refurbished smartphones, electronics and computer accessories.",
    isPopular: false,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.flipkart.com/",
    bg: "bg-cyan-600",
    description: "Refurbished gadgets, smartphones, gaming accessories and tech gear.",
  },

  // A
  {
    id: "amazon",
    name: "Amazon",
    slug: "amazon",
    category: "electronics",
    categoryName: "Electronics",
    initial: "A",
    couponsCount: 42,
    cashbackRate: "Up to 5.0% Cashback",
    cashbackTerms: "Cashback tracks within 24 hours. Valid across electronics, fashion, and home.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.amazon.in/",
    bg: "bg-amber-500",
    description: "India's biggest marketplace for electronics, daily essentials, and fashion.",
    offers: [
      { id: "amz-1", title: "Extra 10% Off on Laptops & Computer Accessories", description: "Applicable on top computing brands on orders above ₹1,499.", code: "AMZTECH10", discount: "10% OFF", type: "coupon", affiliateUrl: "https://www.amazon.in/", isVerified: true },
      { id: "amz-2", title: "Up to 60% Off on Electronics & Smartphones", description: "Save big on top Android and iOS smartphones with exchange offers.", discount: "UP TO 60% OFF", type: "deal", affiliateUrl: "https://www.amazon.in/", isVerified: true },
      { id: "amz-3", title: "Earn Up to 5% Cashback on Amazon Orders", description: "Activate cashback before shopping to receive direct bank transfer rewards.", discount: "5% CASHBACK", type: "cashback", affiliateUrl: "https://www.amazon.in/", isVerified: true },
    ],
  },
  {
    id: "ajio",
    name: "Ajio",
    slug: "ajio",
    category: "fashion",
    categoryName: "Fashion & Clothing",
    initial: "A",
    couponsCount: 29,
    cashbackRate: "Flat ₹150 Cashback",
    cashbackTerms: "Flat cashback on orders above ₹1,299 across fashion, footwear, and accessories.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.ajio.com/",
    bg: "bg-slate-900",
    description: "Trendy fashion and lifestyle store by Reliance with handpicked designer styles.",
    logoUrl: "/logos/ajio.jpg",
    offers: [
      { id: "ajio-1", title: "Extra 25% Off on Men & Women Footwear", description: "Valid on sneakers, sports shoes and formal footwear.", code: "AJIOSTEP25", discount: "25% OFF", type: "coupon", affiliateUrl: "https://www.ajio.com/", isVerified: true },
      { id: "ajio-2", title: "Flat 50-80% Off in Big Bold Sale", description: "Massive savings on top international and Indian fashion labels.", discount: "50-80% OFF", type: "deal", affiliateUrl: "https://www.ajio.com/", isVerified: true },
      { id: "ajio-3", title: "Flat ₹150 Cashback on Fashion Orders", description: "Get ₹150 direct bank cashback on orders above ₹1,299.", discount: "FLAT ₹150", type: "cashback", affiliateUrl: "https://www.ajio.com/", isVerified: true },
    ],
  },
  {
    id: "acer",
    name: "Acer",
    slug: "acer",
    category: "electronics",
    categoryName: "Electronics",
    initial: "A",
    couponsCount: 14,
    cashbackRate: "Up to 3.5% Cashback",
    cashbackTerms: "Valid on laptops, gaming rigs, monitors, and official accessories.",
    isPopular: false,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://store.acer.com/en-in/",
    bg: "bg-emerald-600",
    description: "Gaming laptops, ultrabooks, monitors, and consumer electronics.",
  },

  // B
  {
    id: "boat",
    name: "boAt Lifestyle",
    slug: "boat",
    category: "electronics",
    categoryName: "Electronics",
    initial: "B",
    couponsCount: 17,
    cashbackRate: "Up to 7.0% Cashback",
    cashbackTerms: "Applicable on true wireless earbuds, neckbands, smartwatches, and speakers.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.boat-lifestyle.com/",
    bg: "bg-red-600",
    description: "Leading wearable brand for audio gear, smartwatches, and gaming headphones.",
    offers: [
      { id: "boat-1", title: "Flat ₹300 Off on Airdopes TWS", description: "Use coupon code at checkout on orders above ₹1,499.", code: "BOAT300", discount: "₹300 OFF", type: "coupon", affiliateUrl: "https://www.boat-lifestyle.com/", isVerified: true },
      { id: "boat-2", title: "Up to 70% Off on Best Selling Smartwatches", description: "Limited period flash deal on Bluetooth calling smartwatches.", discount: "70% OFF", type: "deal", affiliateUrl: "https://www.boat-lifestyle.com/", isVerified: true },
    ],
  },
  {
    id: "blinkit",
    name: "Blinkit",
    slug: "blinkit",
    category: "grocery",
    categoryName: "Grocery & Essentials",
    initial: "B",
    couponsCount: 15,
    cashbackRate: "Flat ₹35 Cashback",
    cashbackTerms: "Valid on all instant delivery grocery baskets above ₹300.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://blinkit.com/",
    bg: "bg-yellow-500",
    description: "10-minute grocery and daily essentials delivered right to your doorstep.",
  },

  // C
  {
    id: "croma",
    name: "Croma",
    slug: "croma",
    category: "electronics",
    categoryName: "Electronics",
    initial: "C",
    couponsCount: 22,
    cashbackRate: "Up to 4.5% Cashback",
    cashbackTerms: "Applicable on home appliances, televisions, laptops, and gadgets.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.croma.com/",
    bg: "bg-teal-700",
    description: "Tata's premium electronics retail store for gadgets and home appliances.",
    logoUrl: "/logos/croma.jpg",
  },
  {
    id: "cleartrip",
    name: "Cleartrip",
    slug: "cleartrip",
    category: "travel",
    categoryName: "Travel & Flights",
    initial: "C",
    couponsCount: 16,
    cashbackRate: "Up to ₹800 Cashback",
    cashbackTerms: "Flat cashback on domestic flights and international hotel bookings.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.cleartrip.com/",
    bg: "bg-sky-600",
    description: "Online travel booking platform for cheap flights, hotels, and holiday packages.",
  },

  // D
  {
    id: "dominos",
    name: "Domino's Pizza",
    slug: "dominos",
    category: "food",
    categoryName: "Food & Dining",
    initial: "D",
    couponsCount: 26,
    cashbackRate: "Flat ₹45 Cashback",
    cashbackTerms: "Applicable on online pizza delivery orders placed through website or app.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.dominos.co.in/",
    bg: "bg-blue-600",
    description: "Hot pizza, cheesy garlic bread, choco lava cakes delivered in under 30 minutes.",
    logoUrl: "/logos/dominos.jpg",
    offers: [
      { id: "dom-1", title: "Flat ₹120 Off on Regular & Medium Pizzas", description: "Valid on pizzas of minimum value ₹350.", code: "DOM120", discount: "₹120 OFF", type: "coupon", affiliateUrl: "https://www.dominos.co.in/", isVerified: true },
      { id: "dom-2", title: "Buy 1 Get 1 Free on Every Friday", description: "Order any medium pizza and get another free.", discount: "BOGO FREE", type: "deal", affiliateUrl: "https://www.dominos.co.in/", isVerified: true },
    ],
  },
  {
    id: "dell",
    name: "Dell India",
    slug: "dell",
    category: "electronics",
    categoryName: "Electronics",
    initial: "D",
    couponsCount: 13,
    cashbackRate: "Up to 3.0% Cashback",
    cashbackTerms: "Cashback paid on Inspiron, XPS, Alienware, and G-series laptops.",
    isPopular: false,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.dell.com/en-in",
    bg: "bg-blue-700",
    description: "Computers, business laptops, gaming systems, and computing accessories.",
  },

  // F
  {
    id: "flipkart",
    name: "Flipkart",
    slug: "flipkart",
    category: "electronics",
    categoryName: "Electronics",
    initial: "F",
    couponsCount: 38,
    cashbackRate: "Up to 7.5% Cashback",
    cashbackTerms: "Cashback valid across smartphones, appliances, fashion, and home decor.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.flipkart.com/",
    bg: "bg-blue-500",
    description: "One of India's leading e-commerce platforms with mega sales and superfast delivery.",
    offers: [
      { id: "fk-1", title: "Up to ₹10,000 Off in Big Saving Days", description: "Bank discounts and exchange bonuses on laptops and mobiles.", discount: "UP TO ₹10,000 OFF", type: "deal", affiliateUrl: "https://www.flipkart.com/", isVerified: true },
      { id: "fk-2", title: "Extra ₹500 Off with SuperCoins", description: "Redeem your SuperCoins for extra checkout price reduction.", code: "SUPER500", discount: "₹500 OFF", type: "coupon", affiliateUrl: "https://www.flipkart.com/", isVerified: true },
      { id: "fk-3", title: "Earn Up to 7.5% Cashback on Flipkart Orders", description: "Activate cashback on fashion, home and electronics purchases.", discount: "7.5% CASHBACK", type: "cashback", affiliateUrl: "https://www.flipkart.com/", isVerified: true },
    ],
  },
  {
    id: "fnp",
    name: "Ferns N Petals",
    slug: "ferns-n-petals",
    category: "beauty",
    categoryName: "Beauty & Wellness",
    initial: "F",
    couponsCount: 18,
    cashbackRate: "Up to 8.0% Cashback",
    cashbackTerms: "Valid on flowers, personalized gifts, cakes, and celebration packages.",
    isPopular: false,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.fnp.com/",
    bg: "bg-rose-600",
    description: "Same-day delivery of fresh flowers, birthday cakes, and customized gifts.",
  },

  // H
  {
    id: "hm",
    name: "H&M",
    slug: "hm",
    category: "fashion",
    categoryName: "Fashion & Clothing",
    initial: "H",
    couponsCount: 15,
    cashbackRate: "Up to 5.0% Cashback",
    cashbackTerms: "Cashback paid on men's, women's, kids' clothing and conscious collection.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www2.hm.com/en_in/index.html",
    bg: "bg-red-700",
    description: "Global fashion destination offering modern styles, basics, and sustainable clothes.",
  },
  {
    id: "hp",
    name: "HP Online Store",
    slug: "hp",
    category: "electronics",
    categoryName: "Electronics",
    initial: "H",
    couponsCount: 12,
    cashbackRate: "Up to 3.0% Cashback",
    cashbackTerms: "Valid on HP Pavilion, Envy, Omen gaming laptops, and Smart Tank printers.",
    isPopular: false,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.hp.com/in-en/shop/",
    bg: "bg-cyan-700",
    description: "Official store for HP laptops, printers, monitors, and genuine ink cartridges.",
  },

  // I
  {
    id: "ikea",
    name: "IKEA",
    slug: "ikea",
    category: "home",
    categoryName: "Home & Living",
    initial: "I",
    couponsCount: 14,
    cashbackRate: "Up to 4.0% Cashback",
    cashbackTerms: "Applicable on home furniture, kitchenware, bedding, and storage.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.ikea.com/in/en/",
    bg: "bg-blue-800",
    description: "Affordable Scandinavian furniture, smart home decor, and modular kitchens.",
  },

  // J
  {
    id: "jiomart",
    name: "JioMart",
    slug: "jiomart",
    category: "grocery",
    categoryName: "Grocery & Essentials",
    initial: "J",
    couponsCount: 20,
    cashbackRate: "Flat ₹60 Cashback",
    cashbackTerms: "Valid on grocery orders above ₹499 with free delivery.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.jiomart.com/",
    bg: "bg-blue-600",
    description: "Reliance Jio's online supermarket with groceries, staples, electronics, and fashion.",
  },

  // K
  {
    id: "kfc",
    name: "KFC",
    slug: "kfc",
    category: "food",
    categoryName: "Food & Dining",
    initial: "K",
    couponsCount: 16,
    cashbackRate: "Flat ₹40 Cashback",
    cashbackTerms: "Cashback on online chicken buckets and burger orders above ₹399.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://online.kfc.co.in/",
    bg: "bg-red-800",
    description: "Crispy fried chicken, zinger burgers, popcorn chicken, and meal boxes.",
  },

  // L
  {
    id: "lenskart",
    name: "Lenskart",
    slug: "lenskart",
    category: "fashion",
    categoryName: "Fashion & Clothing",
    initial: "L",
    couponsCount: 21,
    cashbackRate: "Up to 6.5% Cashback",
    cashbackTerms: "Applicable on Vincent Chase, John Jacobs eyeglasses and polarized sunglasses.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.lenskart.com/",
    bg: "bg-indigo-700",
    description: "Eyewear brand for prescription eyeglasses, computer glasses, and sunglasses.",
    logoUrl: "/logos/lenskart.jpg",
  },

  // M
  {
    id: "myntra",
    name: "Myntra",
    slug: "myntra",
    category: "fashion",
    categoryName: "Fashion & Clothing",
    initial: "M",
    couponsCount: 31,
    cashbackRate: "Up to 8.5% Cashback",
    cashbackTerms: "Cashback tracked within 24 hours on all fashion orders.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.myntra.com/",
    bg: "bg-rose-500",
    description: "India's largest fashion e-commerce destination with top international labels.",
    offers: [
      { id: "myntra-1", title: "Flat ₹500 Off on Fashion Orders Above ₹1,999", description: "Valid on top clothing, footwear, and accessories.", code: "MYNTRA500", discount: "FLAT ₹500", type: "coupon", affiliateUrl: "https://www.myntra.com/", isVerified: true },
      { id: "myntra-2", title: "Up to 80% Off in End of Reason Sale", description: "Biggest clearance discounts across 5,000+ fashion brands.", discount: "UP TO 80% OFF", type: "deal", affiliateUrl: "https://www.myntra.com/", isVerified: true },
      { id: "myntra-3", title: "Earn 8.5% Cashback on All Orders", description: "Activate cashback to receive maximum reward back to your bank account.", discount: "8.5% CASHBACK", type: "cashback", affiliateUrl: "https://www.myntra.com/", isVerified: true },
    ],
  },
  {
    id: "makemytrip",
    name: "MakeMyTrip",
    slug: "makemytrip",
    category: "travel",
    categoryName: "Travel & Flights",
    initial: "M",
    couponsCount: 18,
    cashbackRate: "Up to 6.5% Cashback",
    cashbackTerms: "Valid on flight tickets, domestic hotels, and homestays.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.makemytrip.com/",
    bg: "bg-red-500",
    description: "Flights, hotel bookings, holiday packages, train, and bus reservations.",
    offers: [
      { id: "mmt-1", title: "Up to ₹2,500 Off on Domestic Flight Bookings", description: "Instant fare discount on domestic flight tickets.", code: "MMTFLY", discount: "₹2,500 OFF", type: "coupon", affiliateUrl: "https://www.makemytrip.com/", isVerified: true },
      { id: "mmt-2", title: "Flat 30% Off on Luxury Hotel Stays", description: "Special tariff discounts for premium hotels & resorts across India.", discount: "30% OFF", type: "deal", affiliateUrl: "https://www.makemytrip.com/", isVerified: true },
    ],
  },

  // N
  {
    id: "nykaa",
    name: "Nykaa",
    slug: "nykaa",
    category: "beauty",
    categoryName: "Beauty & Wellness",
    initial: "N",
    couponsCount: 22,
    cashbackRate: "Up to 7.0% Cashback",
    cashbackTerms: "Cashback paid on cosmetics, skincare, perfumes, and bath products.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.nykaa.com/",
    bg: "bg-pink-500",
    description: "Premier beauty and cosmetics destination with 100% genuine luxury products.",
    logoUrl: "/logos/nykaa.jpg",
    offers: [
      { id: "nykaa-1", title: "Flat 15% Off on Skincare & Makeup Over ₹499", description: "Valid on verified luxury beauty labels with free delivery.", code: "NYKAAGLOW", discount: "15% OFF", type: "coupon", affiliateUrl: "https://www.nykaa.com/", isVerified: true },
      { id: "nykaa-2", title: "Up to 40% Off on Fragrances & Perfumes", description: "Exclusive discounts on designer eau de parfums and colognes.", discount: "40% OFF", type: "deal", affiliateUrl: "https://www.nykaa.com/", isVerified: true },
    ],
  },
  {
    id: "netmeds",
    name: "Netmeds",
    slug: "netmeds",
    category: "beauty",
    categoryName: "Beauty & Wellness",
    initial: "N",
    couponsCount: 15,
    cashbackRate: "Up to 5.5% Cashback",
    cashbackTerms: "Valid on prescription medicines, vitamins, and Ayurveda products.",
    isPopular: false,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.netmeds.com/",
    bg: "bg-teal-600",
    description: "Online pharmacy delivering medicines, health checkups, and wellness products.",
  },

  // P
  {
    id: "pepperfry",
    name: "Pepperfry",
    slug: "pepperfry",
    category: "home",
    categoryName: "Home & Living",
    initial: "P",
    couponsCount: 19,
    cashbackRate: "Up to 6.0% Cashback",
    cashbackTerms: "Valid on solid wood furniture, lighting, and home decor items.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.pepperfry.com/",
    bg: "bg-amber-700",
    description: "Online furniture, home decor, modular wardrobes, and mattress store.",
  },
  {
    id: "puma",
    name: "Puma India",
    slug: "puma",
    category: "fashion",
    categoryName: "Fashion & Clothing",
    initial: "P",
    couponsCount: 16,
    cashbackRate: "Up to 7.0% Cashback",
    cashbackTerms: "Applicable on running shoes, football boots, tracksuits, and gym wear.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://in.puma.com/",
    bg: "bg-slate-800",
    description: "Sportswear, sneakers, athleisure, and performance athletic gear.",
  },

  // S
  {
    id: "swiggy",
    name: "Swiggy",
    slug: "swiggy",
    category: "food",
    categoryName: "Food & Dining",
    initial: "S",
    couponsCount: 24,
    cashbackRate: "Flat ₹50 Cashback",
    cashbackTerms: "Valid on all restaurant food orders placed through Swiggy.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.swiggy.com/",
    bg: "bg-orange-500",
    description: "Fastest online food delivery service connecting you to thousands of restaurants.",
    offers: [
      { id: "swiggy-1", title: "Flat 50% Off on Food Orders (Up to ₹120)", description: "Applicable on top restaurants in your area.", code: "SWIGGY50", discount: "50% OFF", type: "coupon", affiliateUrl: "https://www.swiggy.com/", isVerified: true },
      { id: "swiggy-2", title: "Free Delivery on Orders with Swiggy One", description: "Zero delivery fees on restaurants within 10 km.", discount: "FREE DELIVERY", type: "deal", affiliateUrl: "https://www.swiggy.com/", isVerified: true },
      { id: "swiggy-3", title: "Flat ₹50 Cashback via CouponKodee", description: "Activate cashback and complete your meal delivery to earn ₹50 back.", discount: "FLAT ₹50", type: "cashback", affiliateUrl: "https://www.swiggy.com/", isVerified: true },
    ],
  },
  {
    id: "samsung",
    name: "Samsung",
    slug: "samsung",
    category: "electronics",
    categoryName: "Electronics",
    initial: "S",
    couponsCount: 16,
    cashbackRate: "Up to 4.5% Cashback",
    cashbackTerms: "Cashback paid on Galaxy smartphones, smart TVs, and home appliances.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.samsung.com/in/",
    bg: "bg-indigo-600",
    description: "Smartphones, Neo QLED TVs, refrigerators, and smart consumer electronics.",
    offers: [
      { id: "samsung-1", title: "Flat ₹3,000 Off on Galaxy Smartphones", description: "Use coupon code at checkout on Galaxy S and Z series.", code: "SAMSAVE3K", discount: "₹3,000 OFF", type: "coupon", affiliateUrl: "https://www.samsung.com/in/", isVerified: true },
      { id: "samsung-2", title: "Up to 45% Off on 4K Smart TVs", description: "Exchange bonus + instant bank card discounts.", discount: "45% OFF", type: "deal", affiliateUrl: "https://www.samsung.com/in/", isVerified: true },
    ],
  },

  // T
  {
    id: "tatacliq",
    name: "Tata CLiQ",
    slug: "tata-cliq",
    category: "fashion",
    categoryName: "Fashion & Clothing",
    initial: "T",
    couponsCount: 20,
    cashbackRate: "Up to 6.0% Cashback",
    cashbackTerms: "Cashback paid on apparel, watches, luxury goods, and footwear.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.tatacliq.com/",
    bg: "bg-rose-700",
    description: "Authentic luxury fashion, footwear, electronics, and accessories by the Tata Group.",
  },

  // U
  {
    id: "urbancompany",
    name: "Urban Company",
    slug: "urban-company",
    category: "home",
    categoryName: "Home & Living",
    initial: "U",
    couponsCount: 14,
    cashbackRate: "Up to 5.0% Cashback",
    cashbackTerms: "Valid on salon at home, AC service, deep cleaning, and appliance repair.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.urbancompany.com/",
    bg: "bg-slate-900",
    description: "Professional home cleaning, salon services, and appliance repair at home.",
  },

  // Z
  {
    id: "zomato",
    name: "Zomato",
    slug: "zomato",
    category: "food",
    categoryName: "Food & Dining",
    initial: "Z",
    couponsCount: 25,
    cashbackRate: "Flat ₹40 Cashback",
    cashbackTerms: "Flat cashback on online food orders placed through Zomato.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.zomato.com/",
    bg: "bg-rose-600",
    description: "Food delivery from popular restaurants, dining discounts, and Gold perks.",
  },
  {
    id: "zepto",
    name: "Zepto",
    slug: "zepto",
    category: "grocery",
    categoryName: "Grocery & Essentials",
    initial: "Z",
    couponsCount: 18,
    cashbackRate: "Flat ₹50 Cashback",
    cashbackTerms: "Flat cashback on 10-minute grocery orders above ₹250.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.zeptonow.com/",
    bg: "bg-purple-700",
    description: "10-minute grocery delivery with fresh vegetables, snacks, and meat.",
  },

  // --- International Premier Stores (US, UK, AE, CA, AU, SG, DE) ---
  {
    id: "walmart",
    name: "Walmart",
    slug: "walmart",
    category: "grocery",
    categoryName: "Grocery & Department",
    initial: "W",
    couponsCount: 45,
    cashbackRate: "Up to 5.0% Cashback",
    cashbackTerms: "Cashback on electronics, home, apparel, and daily essentials.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.walmart.com/",
    bg: "bg-blue-600",
    description: "America's premier hypermarket for groceries, tech, fashion, and clearance rollbacks.",
    countries: ["US", "CA", "GLOBAL"],
    offers: [
      { id: "wmt-1", title: "Up to 50% Off Flash Deals & Rollbacks", description: "Huge savings across smart TVs, laptops, home goods and toys.", discount: "50% OFF", type: "deal", affiliateUrl: "https://www.walmart.com/", isVerified: true, countries: ["US", "CA", "GLOBAL"] },
      { id: "wmt-2", title: "$15 Off on Grocery Pickup & Delivery", description: "Save $15 on your first three grocery orders above $50.", code: "TRIPLE15", discount: "$15 OFF", type: "coupon", affiliateUrl: "https://www.walmart.com/", isVerified: true, countries: ["US", "CA", "GLOBAL"] },
      { id: "wmt-3", title: "Up to 5% Cashback on Walmart Orders", description: "Activate before shopping to earn real bank cashback rewards.", discount: "5% CASHBACK", type: "cashback", affiliateUrl: "https://www.walmart.com/", isVerified: true, countries: ["US", "CA", "GLOBAL"] },
    ],
  },
  {
    id: "target",
    name: "Target",
    slug: "target",
    category: "fashion",
    categoryName: "Fashion & Home",
    initial: "T",
    couponsCount: 32,
    cashbackRate: "Up to 4.0% Cashback",
    cashbackTerms: "Valid across fashion, beauty, home decor, and baby products.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.target.com/",
    bg: "bg-red-600",
    description: "Expect more, pay less on trendy clothing, home essentials, and Target Circle deals.",
    countries: ["US", "GLOBAL"],
    offers: [
      { id: "tgt-1", title: "Extra 20% Off Clothing & Shoes", description: "Target Circle member discount on seasonal apparel.", code: "CIRCLE20", discount: "20% OFF", type: "coupon", affiliateUrl: "https://www.target.com/", isVerified: true, countries: ["US", "GLOBAL"] },
      { id: "tgt-2", title: "Up to 40% Off Home Decor & Furniture", description: "Save big on rugs, kitchenware, bedding and patio.", discount: "40% OFF", type: "deal", affiliateUrl: "https://www.target.com/", isVerified: true, countries: ["US", "GLOBAL"] },
    ],
  },
  {
    id: "bestbuy",
    name: "Best Buy",
    slug: "bestbuy",
    category: "electronics",
    categoryName: "Electronics & Tech",
    initial: "B",
    couponsCount: 28,
    cashbackRate: "Up to 3.5% Cashback",
    cashbackTerms: "Valid on 4K TVs, laptops, gaming consoles, and audio gear.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.bestbuy.com/",
    bg: "bg-yellow-500",
    description: "Leading consumer electronics retailer with verified tech sales and open-box discounts.",
    countries: ["US", "CA", "GLOBAL"],
    offers: [
      { id: "bb-1", title: "Save Up to $300 on Top Laptops & MacBooks", description: "Limited time student and member price drops.", discount: "$300 OFF", type: "deal", affiliateUrl: "https://www.bestbuy.com/", isVerified: true, countries: ["US", "CA", "GLOBAL"] },
      { id: "bb-2", title: "Extra 10% Off Geek Squad Certified Items", description: "Save on refurbished and certified open-box tech.", code: "TECH10", discount: "10% OFF", type: "coupon", affiliateUrl: "https://www.bestbuy.com/", isVerified: true, countries: ["US", "CA", "GLOBAL"] },
    ],
  },
  {
    id: "ebay",
    name: "eBay",
    slug: "ebay",
    category: "electronics",
    categoryName: "Marketplace & Electronics",
    initial: "E",
    couponsCount: 35,
    cashbackRate: "Up to 4.0% Cashback",
    cashbackTerms: "Valid on refurbished electronics, collectibles, fashion and sneakers.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.ebay.com/",
    bg: "bg-blue-500",
    description: "Worldwide marketplace with verified refurbished gadgets, fashion, and certified sellers.",
    countries: ["US", "UK", "AU", "DE", "GLOBAL"],
    offers: [
      { id: "ebay-1", title: "Extra 15% Off Refurbished Tech", description: "Save on top smartphones, laptops and Dyson products.", code: "REFURB15", discount: "15% OFF", type: "coupon", affiliateUrl: "https://www.ebay.com/", isVerified: true, countries: ["US", "UK", "AU", "DE", "GLOBAL"] },
      { id: "ebay-2", title: "Up to 70% Off Daily Deals", description: "Free shipping on thousands of hot seller deals.", discount: "70% OFF", type: "deal", affiliateUrl: "https://www.ebay.com/", isVerified: true, countries: ["US", "UK", "AU", "DE", "GLOBAL"] },
    ],
  },
  {
    id: "nike-us",
    name: "Nike",
    slug: "nike",
    category: "fashion",
    categoryName: "Sportswear & Sneakers",
    initial: "N",
    couponsCount: 24,
    cashbackRate: "Up to 7.0% Cashback",
    cashbackTerms: "Earn cashback on sneakers, running shoes, hoodies, and training gear.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.nike.com/",
    bg: "bg-slate-900",
    description: "World leader in athletic footwear, running sneakers, Jordan gear, and workout apparel.",
    countries: ["US", "UK", "IN", "GLOBAL"],
    offers: [
      { id: "nike-1", title: "Extra 20% Off Select Sale Styles", description: "Nike Member exclusive promo on Air Max, Dunks and fleece.", code: "JUSTDOIT", discount: "20% OFF", type: "coupon", affiliateUrl: "https://www.nike.com/", isVerified: true, countries: ["US", "UK", "IN", "GLOBAL"] },
      { id: "nike-2", title: "Up to 40% Off Shoes & Athletic Wear", description: "Discounted seasonal performance and lifestyle apparel.", discount: "40% OFF", type: "deal", affiliateUrl: "https://www.nike.com/", isVerified: true, countries: ["US", "UK", "IN", "GLOBAL"] },
    ],
  },
  {
    id: "sephora",
    name: "Sephora",
    slug: "sephora",
    category: "beauty",
    categoryName: "Beauty & Cosmetics",
    initial: "S",
    couponsCount: 26,
    cashbackRate: "Up to 6.0% Cashback",
    cashbackTerms: "Valid on luxury skincare, perfume, makeup, and hair wellness.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.sephora.com/",
    bg: "bg-black",
    description: "Premier prestige beauty destination for luxury makeup, fragrances, and skincare.",
    countries: ["US", "CA", "AE", "GLOBAL"],
    offers: [
      { id: "sep-1", title: "Free Deluxe Sample with $35 Order", description: "Choose top luxury skincare trial minis at checkout.", code: "GLOWUP", discount: "FREE GIFT", type: "coupon", affiliateUrl: "https://www.sephora.com/", isVerified: true, countries: ["US", "CA", "AE", "GLOBAL"] },
      { id: "sep-2", title: "Up to 50% Off Beauty Insider Sale", description: "Major discounts on best-selling cosmetics and perfumes.", discount: "50% OFF", type: "deal", affiliateUrl: "https://www.sephora.com/", isVerified: true, countries: ["US", "CA", "AE", "GLOBAL"] },
    ],
  },
  {
    id: "asos",
    name: "ASOS",
    slug: "asos",
    category: "fashion",
    categoryName: "Fashion & Streetwear",
    initial: "A",
    couponsCount: 34,
    cashbackRate: "Up to 7.0% Cashback",
    cashbackTerms: "Valid on over 850 top streetwear and fashion labels.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.asos.com/",
    bg: "bg-slate-900",
    description: "Global online destination for 20-somethings fashion, designer streetwear and shoes.",
    countries: ["UK", "US", "AU", "GLOBAL"],
    offers: [
      { id: "asos-1", title: "Extra 20% Off Everything for New App Users", description: "Save 20% on your first order via ASOS app.", code: "ASOSNEW", discount: "20% OFF", type: "coupon", affiliateUrl: "https://www.asos.com/", isVerified: true, countries: ["UK", "US", "AU", "GLOBAL"] },
      { id: "asos-2", title: "Up to 70% Off Outlet & Clearance", description: "Huge markdowns on Topshop, Nike, Collusion and ASOS DESIGN.", discount: "70% OFF", type: "deal", affiliateUrl: "https://www.asos.com/", isVerified: true, countries: ["UK", "US", "AU", "GLOBAL"] },
    ],
  },
  {
    id: "currys",
    name: "Currys",
    slug: "currys",
    category: "electronics",
    categoryName: "Electronics & Tech",
    initial: "C",
    couponsCount: 22,
    cashbackRate: "Up to 4.5% Cashback",
    cashbackTerms: "Applicable on laptops, OLED TVs, white goods and coffee machines.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.currys.co.uk/",
    bg: "bg-purple-800",
    description: "The UK's largest electrical retailer for consumer tech, appliances, and gaming.",
    countries: ["UK", "GLOBAL"],
    offers: [
      { id: "currys-1", title: "Save £50 When Spending £500+ on Appliances", description: "Use promo code at checkout on washing machines and fridges.", code: "SAVE50", discount: "£50 OFF", type: "coupon", affiliateUrl: "https://www.currys.co.uk/", isVerified: true, countries: ["UK", "GLOBAL"] },
      { id: "currys-2", title: "Up to £200 Off 4K Smart TVs & Laptops", description: "Clearance deals with free UK standard delivery.", discount: "£200 OFF", type: "deal", affiliateUrl: "https://www.currys.co.uk/", isVerified: true, countries: ["UK", "GLOBAL"] },
    ],
  },
  {
    id: "boots",
    name: "Boots UK",
    slug: "boots",
    category: "beauty",
    categoryName: "Health & Beauty",
    initial: "B",
    couponsCount: 25,
    cashbackRate: "Up to 5.0% Cashback",
    cashbackTerms: "Earn cashback plus Boots Advantage Card points on pharmacy and beauty.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.boots.com/",
    bg: "bg-blue-800",
    description: "The UK's leading pharmacy-led health and beauty retailer with Advantage Card perks.",
    countries: ["UK", "GLOBAL"],
    offers: [
      { id: "boots-1", title: "Save 15% When You Spend £50 on Premium Beauty", description: "Valid on No7, Fenty Beauty, Cerave, and premium fragrances.", code: "BEAUTY15", discount: "15% OFF", type: "coupon", affiliateUrl: "https://www.boots.com/", isVerified: true, countries: ["UK", "GLOBAL"] },
      { id: "boots-2", title: "Buy 1 Get 1 Half Price on Vitamins & Skincare", description: "Mix and match wellness products and essentials.", discount: "BOGO 50%", type: "deal", affiliateUrl: "https://www.boots.com/", isVerified: true, countries: ["UK", "GLOBAL"] },
    ],
  },
  {
    id: "noon",
    name: "Noon",
    slug: "noon",
    category: "electronics",
    categoryName: "Electronics & Department",
    initial: "N",
    couponsCount: 38,
    cashbackRate: "Up to 8.0% Cashback",
    cashbackTerms: "Earn cashback on mobiles, home appliances, fashion and Noon Grocery.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.noon.com/",
    bg: "bg-amber-400",
    description: "The Middle East's homegrown online marketplace offering fast UAE delivery.",
    countries: ["AE", "GLOBAL"],
    offers: [
      { id: "noon-1", title: "Flat 10% Off (Up to 50 AED) on UAE Orders", description: "Applicable on express items across electronics and home.", code: "NOON10", discount: "10% OFF", type: "coupon", affiliateUrl: "https://www.noon.com/", isVerified: true, countries: ["AE", "GLOBAL"] },
      { id: "noon-2", title: "Yellow Friday Mega Sale Up to 80% Off", description: "Unbeatable price drops on perfumes, smartphones, and fashion.", discount: "80% OFF", type: "deal", affiliateUrl: "https://www.noon.com/", isVerified: true, countries: ["AE", "GLOBAL"] },
    ],
  },
  {
    id: "namshi",
    name: "Namshi",
    slug: "namshi",
    category: "fashion",
    categoryName: "Fashion & Lifestyle",
    initial: "N",
    couponsCount: 26,
    cashbackRate: "Up to 9.0% Cashback",
    cashbackTerms: "Earn highest cashback on top regional and international clothing labels.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.namshi.com/",
    bg: "bg-slate-900",
    description: "Middle East's favorite fashion and footwear destination with 1,000+ brands.",
    countries: ["AE", "GLOBAL"],
    offers: [
      { id: "namshi-1", title: "Extra 20% Off on Full Price Items", description: "Promo code valid on Mango, Adidas, Nike and Calvin Klein.", code: "STYLE20", discount: "20% OFF", type: "coupon", affiliateUrl: "https://www.namshi.com/", isVerified: true, countries: ["AE", "GLOBAL"] },
      { id: "namshi-2", title: "Up to 60% Off Trending Summer Collection", description: "Discounted shoes, bags, perfumes, and designer apparel.", discount: "60% OFF", type: "deal", affiliateUrl: "https://www.namshi.com/", isVerified: true, countries: ["AE", "GLOBAL"] },
    ],
  },
  {
    id: "carrefour-ae",
    name: "Carrefour UAE",
    slug: "carrefour-ae",
    category: "grocery",
    categoryName: "Supermarket & Essentials",
    initial: "C",
    couponsCount: 30,
    cashbackRate: "Flat 20 AED Cashback",
    cashbackTerms: "Cashback on online grocery and hypermarket orders above 150 AED.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.carrefouruae.com/",
    bg: "bg-blue-700",
    description: "UAE's largest hypermarket for groceries, fresh produce, home goods, and tech.",
    countries: ["AE", "GLOBAL"],
    offers: [
      { id: "crf-1", title: "Flat 15 AED Off on First 3 Grocery Orders", description: "Use voucher code on orders above 100 AED.", code: "SAVE15", discount: "15 AED OFF", type: "coupon", affiliateUrl: "https://www.carrefouruae.com/", isVerified: true, countries: ["AE", "GLOBAL"] },
      { id: "crf-2", title: "Save Up to 50% on Bulk Buys & Fresh Food", description: "Weekly hypermarket discount catalogue with same-day delivery.", discount: "50% OFF", type: "deal", affiliateUrl: "https://www.carrefouruae.com/", isVerified: true, countries: ["AE", "GLOBAL"] },
    ],
  },
  {
    id: "shopee-sg",
    name: "Shopee Singapore",
    slug: "shopee-sg",
    category: "electronics",
    categoryName: "Marketplace & Tech",
    initial: "S",
    couponsCount: 28,
    cashbackRate: "Up to 6.5% Cashback",
    cashbackTerms: "Cashback on Shopee Mall verified merchants and electronics.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://shopee.sg/",
    bg: "bg-orange-600",
    description: "Southeast Asia's leading e-commerce platform with flash sales and free shipping vouchers.",
    countries: ["SG", "GLOBAL"],
    offers: [
      { id: "shp-1", title: "S$10 Off on Min. Spend S$80 at Shopee Mall", description: "Claim brand voucher for verified authentic items.", code: "MALL10", discount: "S$10 OFF", type: "coupon", affiliateUrl: "https://shopee.sg/", isVerified: true, countries: ["SG", "GLOBAL"] },
      { id: "shp-2", title: "Up to 70% Off Daily Super Flash Deals", description: "Limited quantity discounts on gadgets, cosmetics, and groceries.", discount: "70% OFF", type: "deal", affiliateUrl: "https://shopee.sg/", isVerified: true, countries: ["SG", "GLOBAL"] },
    ],
  },
  {
    id: "zalando",
    name: "Zalando",
    slug: "zalando",
    category: "fashion",
    categoryName: "Fashion & Footwear",
    initial: "Z",
    couponsCount: 26,
    cashbackRate: "Up to 6.0% Cashback",
    cashbackTerms: "Valid across Europe on clothing, sneakers and accessories.",
    isPopular: true,
    hasCashback: true,
    hasCoupons: true,
    isVerified: true,
    affiliateUrl: "https://www.zalando.de/",
    bg: "bg-orange-500",
    description: "Europe's leading online fashion destination with 2,500+ top brands and free 100-day returns.",
    countries: ["DE", "GLOBAL"],
    offers: [
      { id: "zal-1", title: "15% Off Orders Above €75 for Zalando Plus", description: "Exclusive promo on new season designer collections.", code: "PLUS15", discount: "15% OFF", type: "coupon", affiliateUrl: "https://www.zalando.de/", isVerified: true, countries: ["DE", "GLOBAL"] },
      { id: "zal-2", title: "Up to 60% Off Season Clearance", description: "Discounted shoes, jackets, and accessories from top European labels.", discount: "60% OFF", type: "deal", affiliateUrl: "https://www.zalando.de/", isVerified: true, countries: ["DE", "GLOBAL"] },
    ],
  },
  {
    "id": "amazon-ca",
    "name": "Amazon Canada",
    "slug": "amazon-ca",
    "category": "electronics",
    "categoryName": "Electronics & Department",
    "initial": "A",
    "couponsCount": 34,
    "cashbackRate": "Up to 6.5% Cashback",
    "cashbackTerms": "Cashback paid across eligible Prime, tech, and household purchases.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.amazon.ca/",
    "bg": "bg-amber-600",
    "description": "Canada's top e-commerce destination for fast Prime delivery, tech, books and daily essentials.",
    "countries": [
      "CA"
    ],
    "offers": [
      {
        "id": "amz-ca-1",
        "title": "Up to 40% Off Canadian Tech & Smart Home Deals",
        "description": "Save on Echo, Kindle, Fire TV, and top electronics with free Prime shipping.",
        "discount": "40% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.amazon.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      },
      {
        "id": "amz-ca-2",
        "title": "Extra C$15 Off First Prime Order Over C$50",
        "description": "Exclusive welcome promotional code for verified members across Canada.",
        "code": "CANPRIME15",
        "discount": "C$15 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.amazon.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      }
    ]
  },
  {
    "id": "walmart-ca",
    "name": "Walmart Canada",
    "slug": "walmart-ca",
    "category": "grocery",
    "categoryName": "Grocery & Department",
    "initial": "W",
    "couponsCount": 28,
    "cashbackRate": "Up to 4.5% Cashback",
    "cashbackTerms": "Valid on online rollbacks, grocery pickup, and home essentials.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.walmart.ca/",
    "bg": "bg-blue-600",
    "description": "Everyday low prices on groceries, family apparel, tech rollbacks, and toys across Canada.",
    "countries": [
      "CA"
    ],
    "offers": [
      {
        "id": "wm-ca-1",
        "title": "C$15 Off First 3 Online Grocery Pickups (Min. C$75)",
        "description": "Apply voucher at checkout for online grocery pickup or home delivery.",
        "code": "SAVEMORE15",
        "discount": "C$15 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.walmart.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      },
      {
        "id": "wm-ca-2",
        "title": "Up to 50% Off Weekly Rollback Specials",
        "description": "Top price drops on kitchen appliances, TVs, and seasonal gear.",
        "discount": "50% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.walmart.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      }
    ]
  },
  {
    "id": "bestbuy-ca",
    "name": "Best Buy Canada",
    "slug": "bestbuy-ca",
    "category": "electronics",
    "categoryName": "Consumer Tech",
    "initial": "B",
    "couponsCount": 22,
    "cashbackRate": "Up to 3.5% Cashback",
    "cashbackTerms": "Valid on computers, audio, 4K TVs, and smart home tech.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.bestbuy.ca/",
    "bg": "bg-yellow-500",
    "description": "Canada's leading electronics retailer for computers, appliances, cell phones and Geek Squad service.",
    "countries": [
      "CA"
    ],
    "offers": [
      {
        "id": "bb-ca-1",
        "title": "Save Up to C$200 on Top Laptops & MacBooks",
        "description": "Instant instant savings with free shipping on qualifying orders.",
        "discount": "UP TO C$200 OFF",
        "type": "deal",
        "affiliateUrl": "https://www.bestbuy.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      },
      {
        "id": "bb-ca-2",
        "title": "Extra C$20 Off Tech Accessories Over C$100",
        "description": "Exclusive digital coupon for peripherals, cables, and cases.",
        "code": "TECHCA20",
        "discount": "C$20 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.bestbuy.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      }
    ]
  },
  {
    "id": "canadian-tire",
    "name": "Canadian Tire",
    "slug": "canadian-tire",
    "category": "home",
    "categoryName": "Automotive & Home",
    "initial": "C",
    "couponsCount": 19,
    "cashbackRate": "Up to 5.0% Cashback",
    "cashbackTerms": "Collect Triangle Rewards and digital cashback across Canada.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.canadiantire.ca/",
    "bg": "bg-red-600",
    "description": "Canada's iconic store for automotive, tools, hardware, sports, outdoor living and home goods.",
    "countries": [
      "CA"
    ],
    "offers": [
      {
        "id": "ct-1",
        "title": "Up to 60% Off Kitchen & Power Tool Deals of the Week",
        "description": "Hot red tag prices on cookware, tools, and tire accessories.",
        "discount": "60% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.canadiantire.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      },
      {
        "id": "ct-2",
        "title": "C$10 Bonus Triangle Reward Voucher Over C$50",
        "description": "Redeem during online checkout for instant bonus credit.",
        "code": "TIRE10",
        "discount": "C$10 BONUS",
        "type": "coupon",
        "affiliateUrl": "https://www.canadiantire.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      }
    ]
  },
  {
    "id": "lululemon",
    "name": "Lululemon Canada",
    "slug": "lululemon",
    "category": "fashion",
    "categoryName": "Athletic Apparel",
    "initial": "L",
    "couponsCount": 16,
    "cashbackRate": "Up to 7.0% Cashback",
    "cashbackTerms": "Valid on leggings, jackets, workout gear, and yoga accessories.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://shop.lululemon.com/",
    "bg": "bg-red-700",
    "description": "Premium Canadian activewear brand for yoga, running, training and everyday athleisure comfort.",
    "countries": [
      "CA"
    ],
    "offers": [
      {
        "id": "lulu-1",
        "title": "Up to 40% Off 'We Made Too Much' Weekly Drop",
        "description": "Exclusive markdowns on Align leggings, Scuba hoodies, and shorts.",
        "discount": "40% OFF",
        "type": "deal",
        "affiliateUrl": "https://shop.lululemon.com/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      },
      {
        "id": "lulu-2",
        "title": "Free Express Shipping Across All Canadian Provinces",
        "description": "No minimum spend required on all orders nationwide.",
        "code": "FREESHIPCA",
        "discount": "FREE SHIPPING",
        "type": "coupon",
        "affiliateUrl": "https://shop.lululemon.com/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      }
    ]
  },
  {
    "id": "hudsons-bay",
    "name": "Hudson's Bay",
    "slug": "hudsons-bay",
    "category": "fashion",
    "categoryName": "Department & Luxury",
    "initial": "H",
    "couponsCount": 18,
    "cashbackRate": "Up to 6.0% Cashback",
    "cashbackTerms": "Applicable on designer fashion, shoes, cosmetics, and bedding.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.thebay.com/",
    "bg": "bg-yellow-600",
    "description": "Canada's historic luxury department store featuring designer apparel, shoes, beauty and home.",
    "countries": [
      "CA"
    ],
    "offers": [
      {
        "id": "bay-1",
        "title": "Extra C$20 Off Orders Over C$100 with Code",
        "description": "Valid on apparel, footwear, and home collections with email signup.",
        "code": "BAYSPRING20",
        "discount": "C$20 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.thebay.com/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      },
      {
        "id": "bay-2",
        "title": "Up to 50% Off Clearance Designer Footwear & Bags",
        "description": "Top luxury labels on seasonal promotion across Canada.",
        "discount": "50% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.thebay.com/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      }
    ]
  },
  {
    "id": "costco-ca",
    "name": "Costco Canada",
    "slug": "costco-ca",
    "category": "grocery",
    "categoryName": "Wholesale & Groceries",
    "initial": "C",
    "couponsCount": 15,
    "cashbackRate": "Up to 3.0% Cashback",
    "cashbackTerms": "Online member-only savings on electronics, appliances and groceries.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.costco.ca/",
    "bg": "bg-blue-700",
    "description": "Canada's favorite warehouse club for bulk foods, high-end electronics, appliances and tires.",
    "countries": [
      "CA"
    ],
    "offers": [
      {
        "id": "cos-ca-1",
        "title": "Up to C$350 Off Member Savings on Home Appliances",
        "description": "Free basic delivery and manufacturer 2-year warranty included.",
        "discount": "C$350 OFF",
        "type": "deal",
        "affiliateUrl": "https://www.costco.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      },
      {
        "id": "cos-ca-2",
        "title": "C$25 Online Voucher on First Grocery Order Over C$150",
        "description": "Member promo for Costco.ca grocery two-day delivery.",
        "code": "COSTCO25CA",
        "discount": "C$25 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.costco.ca/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      }
    ]
  },
  {
    "id": "sephora-ca",
    "name": "Sephora Canada",
    "slug": "sephora-ca",
    "category": "beauty",
    "categoryName": "Prestige Beauty",
    "initial": "S",
    "couponsCount": 21,
    "cashbackRate": "Up to 5.5% Cashback",
    "cashbackTerms": "Cashback earned on skincare, makeup, fragrances and hair care.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.sephora.com/ca/en/",
    "bg": "bg-black",
    "description": "Canada's top destination for prestige cosmetics, trending skincare, hair care and luxury perfumes.",
    "countries": [
      "CA"
    ],
    "offers": [
      {
        "id": "sep-ca-1",
        "title": "20% Off Fragrances & Skincare for Beauty Insiders",
        "description": "Seasonal promo code for registered Beauty Insider members in Canada.",
        "code": "BEAUTYCA20",
        "discount": "20% OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.sephora.com/ca/en/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      },
      {
        "id": "sep-ca-2",
        "title": "Free Deluxe Sample Bag with Any C$45 Purchase",
        "description": "Choose 3 trial samples with free Canadian shipping.",
        "discount": "FREE GIFT",
        "type": "deal",
        "affiliateUrl": "https://www.sephora.com/ca/en/",
        "isVerified": true,
        "countries": [
          "CA"
        ]
      }
    ]
  },
  {
    "id": "amazon-au",
    "name": "Amazon Australia",
    "slug": "amazon-au",
    "category": "electronics",
    "categoryName": "Electronics & Department",
    "initial": "A",
    "couponsCount": 30,
    "cashbackRate": "Up to 7.0% Cashback",
    "cashbackTerms": "Valid on eligible Prime purchases across Australia.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.amazon.com.au/",
    "bg": "bg-amber-600",
    "description": "Fast delivery, unbeatable deals on books, gadgets, pantry and home across Australia.",
    "countries": [
      "AU"
    ],
    "offers": [
      {
        "id": "amz-au-1",
        "title": "Up to 45% Off Aussie Tech & Daily Essentials",
        "description": "Huge discounts for Prime members nationwide with free delivery.",
        "discount": "45% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.amazon.com.au/",
        "isVerified": true,
        "countries": [
          "AU"
        ]
      },
      {
        "id": "amz-au-2",
        "title": "A$15 Off Your First Order Over A$59",
        "description": "App coupon for new Australian Prime shoppers.",
        "code": "AUSPRIME15",
        "discount": "A$15 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.amazon.com.au/",
        "isVerified": true,
        "countries": [
          "AU"
        ]
      }
    ]
  },
  {
    "id": "woolworths",
    "name": "Woolworths",
    "slug": "woolworths",
    "category": "grocery",
    "categoryName": "Supermarket & Groceries",
    "initial": "W",
    "couponsCount": 24,
    "cashbackRate": "Up to 4.0% Cashback",
    "cashbackTerms": "Earn Everyday Rewards and cashback on grocery deliveries.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.woolworths.com.au/",
    "bg": "bg-emerald-600",
    "description": "The fresh food people: Australia's leading supermarket for fresh produce, pantry and household essentials.",
    "countries": [
      "AU"
    ],
    "offers": [
      {
        "id": "ww-1",
        "title": "A$20 Off First Online Delivery Over A$120",
        "description": "Apply coupon code at checkout for door-to-door grocery delivery.",
        "code": "WOOLIES20",
        "discount": "A$20 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.woolworths.com.au/",
        "isVerified": true,
        "countries": [
          "AU"
        ]
      },
      {
        "id": "ww-2",
        "title": "Half Price Weekly Specials on 1,000+ Items",
        "description": "50% off top branded snacks, toiletries and household cleaners.",
        "discount": "50% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.woolworths.com.au/",
        "isVerified": true,
        "countries": [
          "AU"
        ]
      }
    ]
  },
  {
    "id": "jbhifi",
    "name": "JB Hi-Fi",
    "slug": "jbhifi",
    "category": "electronics",
    "categoryName": "Consumer Tech & Audio",
    "initial": "J",
    "couponsCount": 18,
    "cashbackRate": "Up to 3.5% Cashback",
    "cashbackTerms": "Valid on TVs, cameras, gaming consoles, and hi-fi audio.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.jbhifi.com.au/",
    "bg": "bg-yellow-400",
    "description": "Australia's largest home entertainment and electronics retailer with smash hit prices.",
    "countries": [
      "AU"
    ],
    "offers": [
      {
        "id": "jb-1",
        "title": "Up to A$300 Off 4K OLED TVs & Soundbars",
        "description": "Top deals on LG, Samsung and Sony with click & collect in 1 hour.",
        "discount": "UP TO A$300 OFF",
        "type": "deal",
        "affiliateUrl": "https://www.jbhifi.com.au/",
        "isVerified": true,
        "countries": [
          "AU"
        ]
      },
      {
        "id": "jb-2",
        "title": "Extra 10% Off Gaming Headsets & Peripherals",
        "description": "Exclusive promo on Razer, Logitech, and SteelSeries.",
        "code": "JBPLAY10",
        "discount": "10% OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.jbhifi.com.au/",
        "isVerified": true,
        "countries": [
          "AU"
        ]
      }
    ]
  },
  {
    "id": "theiconic",
    "name": "The Iconic",
    "slug": "theiconic",
    "category": "fashion",
    "categoryName": "Fashion & Footwear",
    "initial": "T",
    "couponsCount": 22,
    "cashbackRate": "Up to 6.5% Cashback",
    "cashbackTerms": "Valid on Australian and international designer labels.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.theiconic.com.au/",
    "bg": "bg-slate-900",
    "description": "Australia and New Zealand's premier online fashion and sportswear destination with 3-hour delivery.",
    "countries": [
      "AU"
    ],
    "offers": [
      {
        "id": "icon-1",
        "title": "20% Off Sitewide on Orders Over A$99",
        "description": "Use promo code at checkout on dresses, sneakers and jackets.",
        "code": "ICONIC20",
        "discount": "20% OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.theiconic.com.au/",
        "isVerified": true,
        "countries": [
          "AU"
        ]
      },
      {
        "id": "icon-2",
        "title": "Up to 60% Off Mid-Season Designer Sale",
        "description": "Huge discounts on Tommy Hilfiger, Polo Ralph Lauren and Nike.",
        "discount": "60% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.theiconic.com.au/",
        "isVerified": true,
        "countries": [
          "AU"
        ]
      }
    ]
  },
  {
    "id": "amazon-sg",
    "name": "Amazon Singapore",
    "slug": "amazon-sg",
    "category": "electronics",
    "categoryName": "Electronics & Pantry",
    "initial": "A",
    "couponsCount": 25,
    "cashbackRate": "Up to 6.0% Cashback",
    "cashbackTerms": "Valid on eligible Prime purchases across Singapore.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.amazon.sg/",
    "bg": "bg-amber-600",
    "description": "Fast 2-hour grocery delivery and international marketplace selection in Singapore.",
    "countries": [
      "SG"
    ],
    "offers": [
      {
        "id": "amz-sg-1",
        "title": "S$10 Off Min. Spend S$60 for Prime Members",
        "description": "Exclusive promo voucher on tech, toys and home items.",
        "code": "PRIMSG10",
        "discount": "S$10 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.amazon.sg/",
        "isVerified": true,
        "countries": [
          "SG"
        ]
      },
      {
        "id": "amz-sg-2",
        "title": "Up to 50% Off Top Brand Flash Sales",
        "description": "Daily limited-time specials with free islandwide delivery.",
        "discount": "50% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.amazon.sg/",
        "isVerified": true,
        "countries": [
          "SG"
        ]
      }
    ]
  },
  {
    "id": "lazada-sg",
    "name": "Lazada Singapore",
    "slug": "lazada-sg",
    "category": "electronics",
    "categoryName": "Marketplace & LazMall",
    "initial": "L",
    "couponsCount": 28,
    "cashbackRate": "Up to 5.5% Cashback",
    "cashbackTerms": "Valid on LazMall 100% authentic brand orders.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.lazada.sg/",
    "bg": "bg-indigo-600",
    "description": "Southeast Asia's leading eCommerce platform with guaranteed authentic LazMall items.",
    "countries": [
      "SG"
    ],
    "offers": [
      {
        "id": "laz-1",
        "title": "S$8 Off Every S$80 Spend on LazMall",
        "description": "Stackable brand voucher with instant bank discount.",
        "code": "LAZSG8",
        "discount": "S$8 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.lazada.sg/",
        "isVerified": true,
        "countries": [
          "SG"
        ]
      },
      {
        "id": "laz-2",
        "title": "Up to 70% Off Electronics Super Mega Sale",
        "description": "Huge savings on monitors, headphones, and home appliances.",
        "discount": "70% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.lazada.sg/",
        "isVerified": true,
        "countries": [
          "SG"
        ]
      }
    ]
  },
  {
    "id": "grab-sg",
    "name": "Grab Singapore",
    "slug": "grab-sg",
    "category": "food",
    "categoryName": "Food & Transport",
    "initial": "G",
    "couponsCount": 19,
    "cashbackRate": "Up to 4.0% Cashback",
    "cashbackTerms": "Valid on GrabFood and GrabMart orders across Singapore.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.grab.com/sg/",
    "bg": "bg-emerald-600",
    "description": "Singapore's everyday superapp for food delivery, ride-hailing and grocery mart deliveries.",
    "countries": [
      "SG"
    ],
    "offers": [
      {
        "id": "grab-1",
        "title": "S$5 Off First 3 GrabFood Orders (Min. S$20)",
        "description": "Apply code for instant lunch and dinner discounts.",
        "code": "GRABFOOD5",
        "discount": "S$5 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.grab.com/sg/",
        "isVerified": true,
        "countries": [
          "SG"
        ]
      },
      {
        "id": "grab-2",
        "title": "Free Delivery on Selected Hawker & Restaurant Favourites",
        "description": "Enjoy islandwide delivery discounts on verified dining partners.",
        "discount": "FREE DELIVERY",
        "type": "deal",
        "affiliateUrl": "https://www.grab.com/sg/",
        "isVerified": true,
        "countries": [
          "SG"
        ]
      }
    ]
  },
  {
    "id": "amazon-de",
    "name": "Amazon Germany",
    "slug": "amazon-de",
    "category": "electronics",
    "categoryName": "Electronics & Department",
    "initial": "A",
    "couponsCount": 32,
    "cashbackRate": "Up to 6.5% Cashback",
    "cashbackTerms": "Valid on Prime orders and electronics across Germany & Austria.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.amazon.de/",
    "bg": "bg-amber-600",
    "description": "Germany's biggest online marketplace for tech, household goods, fashion and Prime deals.",
    "countries": [
      "DE"
    ],
    "offers": [
      {
        "id": "amz-de-1",
        "title": "Up to 45% Off Warehouse Deals & Certified Refurbished",
        "description": "Checked and verified electronics with 1-year Amazon warranty.",
        "discount": "45% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.amazon.de/",
        "isVerified": true,
        "countries": [
          "DE"
        ]
      },
      {
        "id": "amz-de-2",
        "title": "Extra €10 Off First Prime App Purchase Over €30",
        "description": "App coupon code for verified customers across Germany.",
        "code": "DESAVE10",
        "discount": "€10 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.amazon.de/",
        "isVerified": true,
        "countries": [
          "DE"
        ]
      }
    ]
  },
  {
    "id": "mediamarkt",
    "name": "MediaMarkt",
    "slug": "mediamarkt",
    "category": "electronics",
    "categoryName": "Consumer Electronics",
    "initial": "M",
    "couponsCount": 20,
    "cashbackRate": "Up to 4.0% Cashback",
    "cashbackTerms": "Valid on smartphones, computers, TVs and home appliances in Germany.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.mediamarkt.de/",
    "bg": "bg-red-600",
    "description": "Europe's number one consumer electronics retailer with Club member advantages.",
    "countries": [
      "DE"
    ],
    "offers": [
      {
        "id": "mm-1",
        "title": "€20 Coupon for Club Members on Purchases Over €100",
        "description": "Join MediaMarkt Club and apply voucher during checkout.",
        "code": "MMCLUB20",
        "discount": "€20 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.mediamarkt.de/",
        "isVerified": true,
        "countries": [
          "DE"
        ]
      },
      {
        "id": "mm-2",
        "title": "Up to 50% Off 'Gutscheinheft' Special Tech Deals",
        "description": "Top discounts on Dyson, Sony, Apple and Samsung gadgets.",
        "discount": "50% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.mediamarkt.de/",
        "isVerified": true,
        "countries": [
          "DE"
        ]
      }
    ]
  },
  {
    "id": "otto",
    "name": "OTTO",
    "slug": "otto",
    "category": "home",
    "categoryName": "Furniture & Living",
    "initial": "O",
    "couponsCount": 18,
    "cashbackRate": "Up to 5.0% Cashback",
    "cashbackTerms": "Valid on furniture, multimedia, fashion and household items.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.otto.de/",
    "bg": "bg-red-700",
    "description": "Germany's major online retailer for modern living, furniture, tech and designer apparel.",
    "countries": [
      "DE"
    ],
    "offers": [
      {
        "id": "otto-1",
        "title": "Extra €15 Welcome Coupon + Free Delivery for New Users",
        "description": "Sign up and use code on orders over €50 across Germany.",
        "code": "OTTOSTART15",
        "discount": "€15 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.otto.de/",
        "isVerified": true,
        "countries": [
          "DE"
        ]
      },
      {
        "id": "otto-2",
        "title": "Up to 40% Off Seasonal Living & Furniture Sale",
        "description": "Big reductions on sofas, mattresses and modern kitchen decor.",
        "discount": "40% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.otto.de/",
        "isVerified": true,
        "countries": [
          "DE"
        ]
      }
    ]
  },
  {
    "id": "amazon-uk",
    "name": "Amazon UK",
    "slug": "amazon-uk",
    "category": "electronics",
    "categoryName": "Electronics & Department",
    "initial": "A",
    "couponsCount": 35,
    "cashbackRate": "Up to 8.5% Cashback",
    "cashbackTerms": "Valid on eligible Prime orders and electronics across the UK.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.amazon.co.uk/",
    "bg": "bg-amber-600",
    "description": "Britain's favorite marketplace for next-day Prime delivery, Kindle, gadgets and groceries.",
    "countries": [
      "UK"
    ],
    "offers": [
      {
        "id": "amz-uk-1",
        "title": "Flat 25% Off + Extra £4.50 Cashback on Orders",
        "description": "Prime eligible discounts on audio, fashion and pantry staples.",
        "discount": "25% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.amazon.co.uk/",
        "isVerified": true,
        "countries": [
          "UK"
        ]
      },
      {
        "id": "amz-uk-2",
        "title": "Extra £10 Off First App Order Over £30",
        "description": "Enter coupon code at checkout for verified Prime shoppers.",
        "code": "UKSAVE10",
        "discount": "£10 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.amazon.co.uk/",
        "isVerified": true,
        "countries": [
          "UK"
        ]
      }
    ]
  },
  {
    "id": "argos",
    "name": "Argos",
    "slug": "argos",
    "category": "home",
    "categoryName": "General Merchandise",
    "initial": "A",
    "couponsCount": 22,
    "cashbackRate": "Up to 4.5% Cashback",
    "cashbackTerms": "Valid on furniture, toys, kitchen appliances and tech in the UK.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.argos.co.uk/",
    "bg": "bg-red-600",
    "description": "One of the UK's leading digital retailers for same-day Fast Track delivery and Click & Collect.",
    "countries": [
      "UK"
    ],
    "offers": [
      {
        "id": "arg-1",
        "title": "Extra 20% Off Selected Furniture & Storage with Code",
        "description": "Apply code at checkout on beds, desks and wardrobes.",
        "code": "FURN20",
        "discount": "20% OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.argos.co.uk/",
        "isVerified": true,
        "countries": [
          "UK"
        ]
      },
      {
        "id": "arg-2",
        "title": "Up to 50% Off Clearance Toys & Home Appliances",
        "description": "Special price drops across Lego, Ninja air fryers and Shark vacuums.",
        "discount": "50% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.argos.co.uk/",
        "isVerified": true,
        "countries": [
          "UK"
        ]
      }
    ]
  },
  {
    "id": "marks-spencer",
    "name": "Marks & Spencer",
    "slug": "marks-spencer",
    "category": "fashion",
    "categoryName": "Quality Clothing & Home",
    "initial": "M",
    "couponsCount": 20,
    "cashbackRate": "Up to 5.0% Cashback",
    "cashbackTerms": "Valid across womenswear, menswear, kidswear, lingerie and home.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.marksandspencer.com/",
    "bg": "bg-slate-900",
    "description": "Beloved British institution known for premium quality fashion, lingerie, food and home decor.",
    "countries": [
      "UK"
    ],
    "offers": [
      {
        "id": "ms-1",
        "title": "£10 Off Orders Above £50 for Sparks Cardholders",
        "description": "Claim digital voucher in Sparks app and apply at checkout.",
        "code": "SPARKS10",
        "discount": "£10 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.marksandspencer.com/",
        "isVerified": true,
        "countries": [
          "UK"
        ]
      },
      {
        "id": "ms-2",
        "title": "Buy 1 Get 2nd Half Price on Selected Bras & Basics",
        "description": "Bestselling lingerie collection with free returns at UK stores.",
        "discount": "BOGO 50%",
        "type": "deal",
        "affiliateUrl": "https://www.marksandspencer.com/",
        "isVerified": true,
        "countries": [
          "UK"
        ]
      }
    ]
  },
  {
    "id": "amazon-ae",
    "name": "Amazon UAE",
    "slug": "amazon-ae",
    "category": "electronics",
    "categoryName": "Electronics & Department",
    "initial": "A",
    "couponsCount": 30,
    "cashbackRate": "Up to 7.0% Cashback",
    "cashbackTerms": "Valid on eligible Prime items delivered across UAE.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.amazon.ae/",
    "bg": "bg-amber-600",
    "description": "Fast free delivery with Amazon Prime across Dubai, Abu Dhabi, Sharjah and all Emirates.",
    "countries": [
      "AE"
    ],
    "offers": [
      {
        "id": "amz-ae-1",
        "title": "Extra 15% Off with Mastercard on Orders Above 100 AED",
        "description": "Bank promo discount automatically verified during checkout.",
        "code": "MC15",
        "discount": "15% OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.amazon.ae/",
        "isVerified": true,
        "countries": [
          "AE"
        ]
      },
      {
        "id": "amz-ae-2",
        "title": "Up to 60% Off Super Sale on Electronics & Beauty",
        "description": "Top brand discounts on Apple, Samsung, Dyson and perfumes.",
        "discount": "60% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.amazon.ae/",
        "isVerified": true,
        "countries": [
          "AE"
        ]
      }
    ]
  },
  {
    "id": "sharaf-dg",
    "name": "Sharaf DG",
    "slug": "sharaf-dg",
    "category": "electronics",
    "categoryName": "Tech & Appliances",
    "initial": "S",
    "couponsCount": 18,
    "cashbackRate": "Up to 4.5% Cashback",
    "cashbackTerms": "Valid on laptops, smartphones, home audio and kitchen appliances in UAE.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://uae.sharafdg.com/",
    "bg": "bg-yellow-500",
    "description": "The UAE's premier electronics and appliance superstore with DG Member guarantees.",
    "countries": [
      "AE"
    ],
    "offers": [
      {
        "id": "sdg-1",
        "title": "50 AED Off on Tech Orders Above 500 AED",
        "description": "Exclusive voucher code valid across laptops and tablets.",
        "code": "DGTECH50",
        "discount": "50 AED OFF",
        "type": "coupon",
        "affiliateUrl": "https://uae.sharafdg.com/",
        "isVerified": true,
        "countries": [
          "AE"
        ]
      },
      {
        "id": "sdg-2",
        "title": "Up to 50% Off Yellow Tag Mega Electronics Deals",
        "description": "Massive savings on 4K TVs, iPhones, and smartwatches.",
        "discount": "50% OFF",
        "type": "deal",
        "affiliateUrl": "https://uae.sharafdg.com/",
        "isVerified": true,
        "countries": [
          "AE"
        ]
      }
    ]
  },
  {
    "id": "sivvi",
    "name": "SIVVI",
    "slug": "sivvi",
    "category": "fashion",
    "categoryName": "Fashion & Streetwear",
    "initial": "S",
    "couponsCount": 20,
    "cashbackRate": "Up to 6.5% Cashback",
    "cashbackTerms": "Valid on clothes, shoes and beauty in Dubai & Abu Dhabi.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.sivvi.com/uae-en/",
    "bg": "bg-slate-900",
    "description": "The Middle East's fastest fashion app with 3-hour delivery in Dubai.",
    "countries": [
      "AE"
    ],
    "offers": [
      {
        "id": "siv-1",
        "title": "Extra 20% Off Everything with Verified Code",
        "description": "Use code at checkout for additional markdown on Mango, Nike and Tommy.",
        "code": "SIVVI20",
        "discount": "20% OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.sivvi.com/uae-en/",
        "isVerified": true,
        "countries": [
          "AE"
        ]
      },
      {
        "id": "siv-2",
        "title": "Up to 70% Off Outlet Clearance on 2,000+ Brands",
        "description": "Huge discounts on sneakers, modest dresses, and activewear.",
        "discount": "70% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.sivvi.com/uae-en/",
        "isVerified": true,
        "countries": [
          "AE"
        ]
      }
    ]
  },
  {
    "id": "amazon-us",
    "name": "Amazon US",
    "slug": "amazon-us",
    "category": "electronics",
    "categoryName": "Electronics & Department",
    "initial": "A",
    "couponsCount": 45,
    "cashbackRate": "Up to 8.5% Cashback",
    "cashbackTerms": "Valid on eligible Prime purchases across the United States.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.amazon.com/",
    "bg": "bg-amber-600",
    "description": "America's largest online superstore with 1-day Prime shipping, smart home, and groceries.",
    "countries": [
      "US"
    ],
    "offers": [
      {
        "id": "amz-us-1",
        "title": "Flat 25% Off + Extra $45.00 Cashback on Electronics",
        "description": "Prime eligible discounts on gadgets, home audio and PC gear.",
        "discount": "25% OFF",
        "type": "deal",
        "affiliateUrl": "https://www.amazon.com/",
        "isVerified": true,
        "countries": [
          "US"
        ]
      },
      {
        "id": "amz-us-2",
        "title": "Save $20 on Orders Above $100 with Code",
        "description": "Verified digital promo code for Prime members at online checkout.",
        "code": "USSAVE20",
        "discount": "$20 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.amazon.com/",
        "isVerified": true,
        "countries": [
          "US"
        ]
      }
    ]
  },
  {
    "id": "apple-us",
    "name": "Apple Store",
    "slug": "apple-us",
    "category": "electronics",
    "categoryName": "Tech & Computing",
    "initial": "A",
    "couponsCount": 14,
    "cashbackRate": "Up to 3.0% Cashback",
    "cashbackTerms": "Valid on Macs, iPads, Apple Watch, and certified accessories.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.apple.com/",
    "bg": "bg-slate-900",
    "description": "Discover the innovative world of Apple: iPhone, iPad, Apple Watch, Mac, and Apple TV.",
    "countries": [
      "US"
    ],
    "offers": [
      {
        "id": "app-1",
        "title": "Up to $150 Apple Gift Card with Qualifying Purchases",
        "description": "Education and seasonal promotion on MacBook Air, Pro and iPad.",
        "discount": "$150 GIFT CARD",
        "type": "deal",
        "affiliateUrl": "https://www.apple.com/",
        "isVerified": true,
        "countries": [
          "US"
        ]
      },
      {
        "id": "app-2",
        "title": "Save Up to $650 with Apple Trade-In on iPhone",
        "description": "Instant trade-in credit toward your new device with free shipping.",
        "discount": "UP TO $650 OFF",
        "type": "deal",
        "affiliateUrl": "https://www.apple.com/",
        "isVerified": true,
        "countries": [
          "US"
        ]
      }
    ]
  },
  {
    "id": "costco",
    "name": "Costco Wholesale",
    "slug": "costco",
    "category": "grocery",
    "categoryName": "Wholesale & Department",
    "initial": "C",
    "couponsCount": 20,
    "cashbackRate": "Up to 3.0% Cashback",
    "cashbackTerms": "Valid on online Costco member-only deals in the US.",
    "isPopular": true,
    "hasCashback": true,
    "hasCoupons": true,
    "isVerified": true,
    "affiliateUrl": "https://www.costco.com/",
    "bg": "bg-blue-700",
    "description": "America's premier membership warehouse club offering huge bulk value on food and electronics.",
    "countries": [
      "US"
    ],
    "offers": [
      {
        "id": "cos-1",
        "title": "Up to $400 Off Major Kitchen Appliances & Laundry",
        "description": "Free basic delivery, haul away and 2-year warranty included.",
        "discount": "$400 OFF",
        "type": "deal",
        "affiliateUrl": "https://www.costco.com/",
        "isVerified": true,
        "countries": [
          "US"
        ]
      },
      {
        "id": "cos-2",
        "title": "$50 Off Online Orders Over $500 for Executive Members",
        "description": "Member appreciation discount coupon applied at checkout.",
        "code": "COSTCO50",
        "discount": "$50 OFF",
        "type": "coupon",
        "affiliateUrl": "https://www.costco.com/",
        "isVerified": true,
        "countries": [
          "US"
        ]
      }
    ]
  },
]

export function getStoreOffers(store: StoreItem): StoreOffer[] {
  const storeCountries = store.countries || getStoreCountries(store.slug)
  if (store.offers && store.offers.length > 0) {
    const offers = store.offers.map((o) => ({
      ...o,
      countries: o.countries || storeCountries,
    }))

    // If store has cashbackRate but no cashback offer listed, append verified cashback offer
    if (store.cashbackRate && !offers.some((o) => o.type === "cashback")) {
      offers.push({
        id: `${store.id}-cb`,
        title: `Earn ${store.cashbackRate} on All Valid Orders`,
        description: store.cashbackTerms || `Activate cashback before shopping at ${store.name} to receive real bank rewards.`,
        discount: store.cashbackRate,
        type: "cashback",
        affiliateUrl: store.affiliateUrl,
        isVerified: true,
        countries: storeCountries,
      })
    }

    return offers
  }

  // If store has cashbackRate but no coupon/deal offers, return verified cashback offer
  if (store.cashbackRate) {
    return [
      {
        id: `${store.id}-cb`,
        title: `Earn ${store.cashbackRate} on All Valid Orders`,
        description: store.cashbackTerms || `Activate cashback before shopping at ${store.name} to receive real bank rewards.`,
        discount: store.cashbackRate,
        type: "cashback",
        affiliateUrl: store.affiliateUrl,
        isVerified: true,
        countries: storeCountries,
      },
    ]
  }

  // If the store has 0 valid offers, return empty array without synthesizing fake offers
  return []
}

export function filterOffersByCashback(offers: StoreOffer[], isCashbackEnabled: boolean): StoreOffer[] {
  if (isCashbackEnabled) return offers
  return offers.filter(
    (o) => o.type !== "cashback" && !/cashback/i.test(o.title || "") && !/cashback/i.test(o.discount || "")
  )
}

// Synchronize every store's couponsCount strictly with its exact count of available offers
initialStores.forEach((s) => {
  const actualOffers = getStoreOffers(s)
  s.offers = actualOffers
  s.couponsCount = actualOffers.length
})

export function getAllStores(isCashbackEnabled: boolean = true): StoreItem[] {
  return initialStores.map((s) => {
    const rawOffers = (s.offers && s.offers.length > 0) ? s.offers : getStoreOffers(s)
    const offers = filterOffersByCashback(rawOffers, isCashbackEnabled)
    return {
      ...s,
      offers,
      couponsCount: offers.length,
      logoUrl: s.logoUrl || getBrandLogo(s.slug) || getBrandLogo(s.name) || `/logos/${s.slug}.svg`,
      countries: s.countries || getStoreCountries(s.slug),
    }
  })
}

export function getStoreBySlug(slug: string, isCashbackEnabled: boolean = true): StoreItem | undefined {
  const normalized = slug.toLowerCase().trim()
  const store = initialStores.find(
    (s) => s.slug === normalized || s.id === normalized || s.name.toLowerCase() === normalized
  )
  if (!store) return undefined
  const rawOffers = (store.offers && store.offers.length > 0) ? store.offers : getStoreOffers(store)
  const offers = filterOffersByCashback(rawOffers, isCashbackEnabled)
  return {
    ...store,
    offers,
    couponsCount: offers.length,
    logoUrl: store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name) || `/logos/${store.slug}.svg`,
    countries: store.countries || getStoreCountries(store.slug),
  }
}

export function getStoresByCategory(category: string, isCashbackEnabled: boolean = true): StoreItem[] {
  const normalized = category.toLowerCase().trim()
  return initialStores
    .filter((s) => s.category === normalized)
    .map((s) => {
      const rawOffers = (s.offers && s.offers.length > 0) ? s.offers : getStoreOffers(s)
      const offers = filterOffersByCashback(rawOffers, isCashbackEnabled)
      return {
        ...s,
        offers,
        couponsCount: offers.length,
        logoUrl: s.logoUrl || getBrandLogo(s.slug) || getBrandLogo(s.name) || `/logos/${s.slug}.svg`,
        countries: s.countries || getStoreCountries(s.slug),
      }
    })
}

export function getSimilarStores(currentSlug: string, category: string, limit = 4, isCashbackEnabled: boolean = true): StoreItem[] {
  return initialStores
    .filter((s) => s.slug !== currentSlug && s.category === category)
    .slice(0, limit)
    .map((s) => {
      const rawOffers = (s.offers && s.offers.length > 0) ? s.offers : getStoreOffers(s)
      const offers = filterOffersByCashback(rawOffers, isCashbackEnabled)
      return {
        ...s,
        offers,
        couponsCount: offers.length,
        logoUrl: s.logoUrl || getBrandLogo(s.slug) || getBrandLogo(s.name) || `/logos/${s.slug}.svg`,
        countries: s.countries || getStoreCountries(s.slug),
      }
    })
}

