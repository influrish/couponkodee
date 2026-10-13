import type { GlobalConfig } from "payload"

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer & Legal",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "brand",
      type: "group",
      label: "Brand Info & Mission",
      fields: [
        {
          name: "aboutTitle",
          type: "text",
          defaultValue: "About CouponKodee",
          admin: {
            description: "Title above brand description (e.g. 'About CouponKodee')",
          },
        },
        {
          name: "brandName",
          type: "text",
          defaultValue: "Coupon",
          required: true,
        },
        {
          name: "brandHighlight",
          type: "text",
          defaultValue: "Kodee",
          required: true,
        },
        {
          name: "tagline",
          type: "text",
          defaultValue: "The Smart Savings & Cashback Hub",
        },
        {
          name: "bio",
          type: "textarea",
          defaultValue:
            "At CouponKodee, we help you save money through our comprehensive listing of verified coupons, exclusive promo codes, and real bank-transferable cashback from 500+ top online stores.",
          required: true,
        },
      ],
    },
    {
      name: "appearance",
      type: "group",
      label: "Footer Formatting & Colors",
      fields: [
        {
          name: "themePreset",
          type: "select",
          defaultValue: "white",
          label: "Footer Background Theme Preset",
          options: [
            { label: "Clean White (Default)", value: "white" },
            { label: "Warm Cream / Off-White (#FAF7F2)", value: "cream" },
            { label: "Soft Slate Gray (#F8FAFC)", value: "slate" },
            { label: "Deep Midnight Dark (#0F172A)", value: "dark" },
            { label: "Custom Hex Color", value: "custom" },
          ],
        },
        {
          name: "customBgColor",
          type: "text",
          label: "Custom Footer Background Hex (e.g. #FAF7F2 or #1e1e2f)",
          admin: {
            description: "Used when 'Custom Hex Color' is selected above",
          },
        },
        {
          name: "customTextColor",
          type: "text",
          label: "Custom Footer Text Color Hex (e.g. #334155 or #f1f5f9)",
          admin: {
            description: "Optional custom text color for footer copy",
          },
        },
        {
          name: "accentColor",
          type: "select",
          defaultValue: "purple",
          label: "Footer Accent & Link Hover Color",
          options: [
            { label: "Royal Purple (Default)", value: "purple" },
            { label: "Emerald Green", value: "emerald" },
            { label: "Indigo Blue", value: "indigo" },
            { label: "Vibrant Orange", value: "orange" },
            { label: "Sky Blue", value: "blue" },
            { label: "Custom Hex Color", value: "custom" },
          ],
        },
        {
          name: "customAccentColor",
          type: "text",
          label: "Custom Accent Hex (e.g. #7c3aed)",
          admin: {
            description: "Used when 'Custom Hex Color' is selected above",
          },
        },
        {
          name: "socialIconStyle",
          type: "select",
          defaultValue: "colored-circle",
          label: "Social Media Icon Style",
          options: [
            { label: "Official Brand Colors (Circular)", value: "colored-circle" },
            { label: "Dark Monochrome Circles", value: "monochrome-dark" },
            { label: "Rounded Squares (Modern)", value: "rounded-square" },
            { label: "Outline / Bordered Circles", value: "outline" },
          ],
        },
        {
          name: "layoutColumns",
          type: "select",
          defaultValue: "5-cols",
          label: "Footer Layout Density",
          options: [
            { label: "5 Columns (Full: Brand + 3 Link Columns + Social)", value: "5-cols" },
            { label: "4 Columns (Compact)", value: "4-cols" },
            { label: "3 Columns (Minimal)", value: "3-cols" },
          ],
        },
        {
          name: "showSocialLinks",
          type: "checkbox",
          defaultValue: true,
          label: "Show 'Follow Us' Social Media Column",
        },
        {
          name: "showCopyrightBar",
          type: "checkbox",
          defaultValue: true,
          label: "Show Bottom Copyright & Legal Links Bar",
        },
      ],
    },
    {
      name: "socialLinks",
      type: "group",
      label: "Social Media Links",
      fields: [
        {
          name: "facebook",
          type: "text",
          defaultValue: "https://facebook.com",
        },
        {
          name: "twitter",
          type: "text",
          defaultValue: "https://twitter.com",
        },
        {
          name: "pinterest",
          type: "text",
          defaultValue: "https://pinterest.com",
        },
        {
          name: "whatsapp",
          type: "text",
          defaultValue: "https://whatsapp.com",
        },
        {
          name: "instagram",
          type: "text",
          defaultValue: "https://instagram.com",
        },
        {
          name: "youtube",
          type: "text",
          defaultValue: "https://youtube.com",
        },
        {
          name: "telegram",
          type: "text",
          defaultValue: "https://t.me",
        },
        {
          name: "linkedin",
          type: "text",
        },
      ],
    },
    {
      name: "columns",
      type: "array",
      label: "Footer Navigation Columns",
      labels: {
        singular: "Column",
        plural: "Columns",
      },
      defaultValue: [
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
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          admin: {
            description: "Column heading (e.g. 'Popular Stores')",
          },
        },
        {
          name: "links",
          type: "array",
          label: "Links in this Column",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "url",
              type: "text",
              required: true,
            },
            {
              name: "isHighlighted",
              type: "checkbox",
              defaultValue: false,
              label: "Highlight link (purple color and bold)",
            },
            {
              name: "openInNewTab",
              type: "checkbox",
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: "disclosure",
      type: "group",
      label: "Affiliate Disclosure Notice",
      fields: [
        {
          name: "showDisclosure",
          type: "checkbox",
          defaultValue: true,
          label: "Show Affiliate Disclosure statement box",
        },
        {
          name: "title",
          type: "text",
          defaultValue: "Affiliate Disclosure & Transparency Statement",
        },
        {
          name: "content",
          type: "textarea",
          defaultValue:
            "CouponKodee is a free online coupons, deals, and cashback portal. When you click through our links to partner merchants (such as Amazon, Flipkart, Myntra, Swiggy, Ajio, Nykaa, and others) and make a purchase, we may receive an affiliate referral commission at no additional cost to you. We pass a major portion of this commission directly back to our users as Cashback. All product trademarks, logos, and brand names belong to their respective owners.",
        },
      ],
    },
    {
      name: "copyright",
      type: "group",
      label: "Bottom Copyright Bar",
      fields: [
        {
          name: "text",
          type: "text",
          defaultValue: "© {year} CouponKodee. All rights reserved. Made for smart shoppers.",
          admin: {
            description: "Use '{year}' to automatically insert current year",
          },
        },
        {
          name: "bottomLinks",
          type: "array",
          label: "Bottom Quick Legal Links",
          defaultValue: [
            { label: "Privacy", url: "/privacy" },
            { label: "Terms", url: "/terms" },
            { label: "Disclosure", url: "/affiliate-disclosure" },
          ],
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true },
          ],
        },
      ],
    },
  ],
}

