export interface HeaderData {
  brand: {
    brandName: string
    brandHighlight: string
    customLogoUrl?: string
  }
  appearance?: {
    navbarBg?: "white" | "slate" | "dark" | "transparent" | "custom"
    customBgColor?: string
    accentColor?: string
    customAccentColor?: string
    announcementBg?: "purple-gradient" | "emerald" | "amber" | "dark" | "custom"
    customAnnouncementBg?: string
    customAnnouncementTextColor?: string
  }
  announcement: {
    enabled: boolean
    text?: string
    link?: string
    badge?: string
  }
  search: {
    placeholder: string
    buttonText: string
  }
  menuItems: Array<{
    label: string
    url: string
    badge?: string
    isCashback?: boolean
    openInNewTab?: boolean
  }>
  features: {
    showCountrySelector: boolean
    showSearch: boolean
    loginLabel: string
    signupLabel: string
  }
}

export interface FooterData {
  brand: {
    aboutTitle?: string
    brandName: string
    brandHighlight: string
    tagline?: string
    customLogoUrl?: string
    bio: string
  }
  appearance?: {
    themePreset?: "white" | "cream" | "slate" | "dark" | "custom"
    customBgColor?: string
    customTextColor?: string
    accentColor?: string
    customAccentColor?: string
    socialIconStyle?: "colored-circle" | "monochrome-dark" | "rounded-square" | "outline"
    layoutColumns?: "5-cols" | "4-cols" | "3-cols"
    showSocialLinks?: boolean
    showCopyrightBar?: boolean
  }
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    telegram?: string
    linkedin?: string
    pinterest?: string
    whatsapp?: string
  }
  columns: Array<{
    title: string
    links: Array<{
      label: string
      url: string
      isHighlighted?: boolean
      openInNewTab?: boolean
    }>
  }>
  disclosure: {
    showDisclosure: boolean
    title: string
    content: string
  }
  copyright: {
    text: string
    bottomLinks: Array<{
      label: string
      url: string
    }>
  }
}

export interface HeroBannerItem {
  storeName: string
  title: string
  subtitle?: string
  code: string
  cashbackRate?: string
  storeRating?: string
  successRate?: string
  linkUrl?: string
  countryCode?: string
  bannerImage?: string
}

export interface SiteSettingsData {
  cashbackVisibility?: "on" | "off"
  appearance?: {
    primaryAccent?: "purple" | "indigo" | "emerald" | "orange" | "blue"
    heroBackgroundStyle?: "radial-glow" | "clean-white" | "soft-slate"
  }
  hero: {
    kicker: string
    title: string
    subtitle: string
    badgeText: string
    cashbackPillLabel?: string
    autoSlideInterval?: number
    showOfficialBadge?: boolean
    bannerHoverPause?: boolean
    banners?: HeroBannerItem[]
  }
  howItWorks: {
    kicker: string
    title: string
    subtitle: string
    steps: Array<{
      stepNumber: string
      title: string
      description: string
    }>
  }
  faqs: {
    title: string
    subtitle: string
    items: Array<{
      q: string
      a: string
    }>
  }
  newsletter: {
    heading: string
    subtitle: string
    buttonText: string
  }
  contact: {
    supportEmail: string
    partnershipsEmail: string
    supportPhone: string
    address: string
  }
}

export interface PageData {
  title: string
  slug: string
  subtitle?: string
  body: string
  metaTitle?: string
  metaDescription?: string
}

export const defaultHeaderData: HeaderData = {
  brand: {
    brandName: "Coupon",
    brandHighlight: "Kodee",
  },
  appearance: {
    navbarBg: "white",
    accentColor: "purple",
    announcementBg: "purple-gradient",
  },
  announcement: {
    enabled: false,
    text: "🎉 Special: Extra Cashback on all partner stores today!",
    link: "/cashback",
    badge: "Special Offer",
  },
  search: {
    placeholder: "Search 500+ stores, coupons or deals...",
    buttonText: "Search",
  },
  menuItems: [
    { label: "Home", url: "/" },
    { label: "Stores", url: "/stores" },
    { label: "Categories", url: "/categories" },
    { label: "Coupons", url: "/coupons" },
    { label: "Deals", url: "/deals" },
    { label: "Cashback", url: "/cashback", badge: "Extra Cash", isCashback: true },
  ],
  features: {
    showCountrySelector: true,
    showSearch: true,
    loginLabel: "Sign In",
    signupLabel: "Join Free",
  },
}

export const defaultFooterData: FooterData = {
  brand: {
    aboutTitle: "About CouponKodee",
    brandName: "Coupon",
    brandHighlight: "Kodee",
    tagline: "The Smart Savings & Cashback Hub",
    bio: "At CouponKodee, we help you save money through our comprehensive listing of verified coupons, exclusive promo codes, and real bank-transferable cashback from 500+ top online stores.",
  },
  appearance: {
    themePreset: "white",
    accentColor: "purple",
    socialIconStyle: "colored-circle",
    layoutColumns: "5-cols",
    showSocialLinks: true,
    showCopyrightBar: true,
  },
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    pinterest: "https://pinterest.com",
    whatsapp: "https://whatsapp.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    telegram: "https://t.me",
  },
  columns: [
    {
      title: "Our Company",
      links: [
        { label: "About Us", url: "/about" },
        { label: "Contact Us", url: "/contact" },
        { label: "Frequently Asked Questions", url: "/faqs" },
        { label: "Affiliate Disclosure", url: "/affiliate-disclosure" },
        { label: "Telegram Community", url: "https://t.me", openInNewTab: true },
        { label: "WhatsApp Alerts", url: "https://whatsapp.com", openInNewTab: true },
      ],
    },
    {
      title: "Important Links",
      links: [
        { label: "Refer & Earn", url: "/cashback" },
        { label: "How Cashback Works", url: "/cashback" },
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms of Service", url: "/terms" },
        { label: "Help & Support", url: "/faqs" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "Today's Top Deals", url: "/deals" },
        { label: "All Online Stores", url: "/stores" },
        { label: "Browse All Categories", url: "/categories" },
        { label: "Verified Promo Codes", url: "/coupons" },
        { label: "High Cashback Offers", url: "/cashback" },
      ],
    },
  ],
  disclosure: {
    showDisclosure: true,
    title: "Affiliate Disclosure & Transparency Statement",
    content:
      "CouponKodee is a free online coupons, deals, and cashback portal. When you click through our links to partner merchants (such as Amazon, Flipkart, Myntra, Swiggy, Ajio, and others) and make a purchase, we may receive an affiliate referral commission at no additional cost to you. We pass a major portion of this commission directly back to our users as Cashback. All product trademarks, logos, and brand names belong to their respective owners.",
  },
  copyright: {
    text: "© {year} CouponKodee. All rights reserved. Made for smart shoppers.",
    bottomLinks: [
      { label: "Privacy Policy", url: "/privacy" },
      { label: "Terms of Service", url: "/terms" },
      { label: "Affiliate Disclosure", url: "/affiliate-disclosure" },
    ],
  },
}

export const defaultSiteSettingsData: SiteSettingsData = {
  cashbackVisibility: "off",
  appearance: {
    primaryAccent: "purple",
    heroBackgroundStyle: "radial-glow",
  },
  hero: {
    kicker: "INDIA'S LEADING COUPONS & DEALS PLATFORM",
    title: "Instant Verified Coupons & Exclusive Deals",
    subtitle:
      "Discover verified coupon codes and exclusive deals from India's top 500+ stores. Find offers and save on your favourite brands.",
    badgeText: "100% Free Service & Instant Verified Savings",
    cashbackPillLabel: "Verified Discounts",
    autoSlideInterval: 4.5,
    showOfficialBadge: true,
    bannerHoverPause: true,
  },
  howItWorks: {
    kicker: "EASY AS 1, 2, 3",
    title: "How CouponKodee Works",
    subtitle:
      "Start saving in three easy steps with verified promo codes and instant discounts.",
    steps: [
      {
        stepNumber: "01",
        title: "Find Your Store & Offer",
        description:
          "Browse 500+ top retailers. Click on any verified coupon or deal link to activate savings.",
      },
      {
        stepNumber: "02",
        title: "Shop & Apply Code",
        description:
          "Shop directly on the retailer store as usual. Paste the copied promo code at checkout for instant discounts.",
      },
      {
        stepNumber: "03",
        title: "Enjoy Verified Savings",
        description:
          "Save money instantly with verified promo codes and discount deals applied directly at checkout.",
      },
    ],
  },
  faqs: {
    title: "Frequently Asked Questions",
    subtitle:
      "Everything you need to know about using CouponKodee, copying codes, and saving money.",
    items: [
      {
        q: "Are the coupon codes and discounts completely free to use?",
        a: "Yes, 100% free! You never have to pay anything to use CouponKodee or copy coupon codes. There are no hidden fees or subscription charges.",
      },
      {
        q: "How often are promo codes verified?",
        a: "Our automated systems and deal curation team test and verify coupon codes daily to ensure only working and valid offers are presented to shoppers.",
      },
      {
        q: "How do I apply a coupon code?",
        a: "Click on any offer button to copy the code to your clipboard and open the retailer website. Paste the code in the promo code or voucher field at checkout for an instant discount.",
      },
      {
        q: "What should I do if a coupon code doesn't work?",
        a: "Some codes have specific conditions like minimum order values or category exclusions. Try checking alternative verified coupons on that store's page.",
      },
    ],
  },
  newsletter: {
    heading: "Get the Best Deals in Your Inbox",
    subtitle: "Subscribe and never miss a verified coupon or fresh deal.",
    buttonText: "Subscribe",
  },
  contact: {
    supportEmail: "support@couponkodee.com",
    partnershipsEmail: "partners@couponkodee.com",
    supportPhone: "+91 98765 43210",
    address: "CouponKodee Savings Network, Cyber City, Gurugram, India",
  },
}
