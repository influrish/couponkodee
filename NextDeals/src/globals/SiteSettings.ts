import type { GlobalConfig } from "payload"
import { anyone, isStaff } from "../access/roles"

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings & Visibility",
  access: {
    read: anyone,
    update: isStaff,
  },
  fields: [
    {
      name: "cashbackVisibility",
      type: "radio",
      label: "Cashback Visibility",
      defaultValue: "off",
      required: true,
      admin: {
        description:
          "Controls whether cashback functionality, sections, rates, badges, tabs, and routes are shown or completely hidden on the public website. Default is OFF.",
        layout: "horizontal",
      },
      options: [
        { label: "OFF - Hide All Cashback from Public Website (Default)", value: "off" },
        { label: "ON - Show Cashback Functionality & Offers", value: "on" },
      ],
    },
    {
      name: "appearance",
      type: "group",
      label: "Body & Homepage Global Formatting",
      fields: [
        {
          name: "primaryAccent",
          type: "select",
          defaultValue: "purple",
          label: "Primary Brand Accent Color",
          options: [
            { label: "Royal Purple (Default)", value: "purple" },
            { label: "Indigo Blue", value: "indigo" },
            { label: "Emerald Green", value: "emerald" },
            { label: "Vibrant Orange", value: "orange" },
            { label: "Ocean Blue", value: "blue" },
          ],
        },
        {
          name: "heroBackgroundStyle",
          type: "select",
          defaultValue: "radial-glow",
          label: "Hero Showcase Background Style",
          options: [
            { label: "Vibrant Radial Ambient Glows (Default)", value: "radial-glow" },
            { label: "Clean Minimalist White", value: "clean-white" },
            { label: "Soft Slate Contrast", value: "soft-slate" },
          ],
        },
      ],
    },
    {
      name: "hero",
      type: "group",
      label: "Homepage Hero Showcase",
      fields: [
        {
          name: "kicker",
          type: "text",
          defaultValue: "INDIA'S LEADING CASHBACK & COUPONS PLATFORM",
          admin: {
            description: "Super-badge text above the main headline",
          },
        },
        {
          name: "title",
          type: "text",
          defaultValue: "Real Cashback, Instant Verified Coupons",
          required: true,
          admin: {
            description: "Main big headline on the homepage",
          },
        },
        {
          name: "subtitle",
          type: "textarea",
          defaultValue:
            "Shop at India's top 500+ stores, automatically apply verified coupon codes, and earn direct bank-transferable cashback on every order.",
          required: true,
        },
        {
          name: "badgeText",
          type: "text",
          defaultValue: "100% Free Service & Bank Transferable Rewards",
        },
        {
          name: "cashbackPillLabel",
          type: "text",
          defaultValue: "Earn Real Bank Cashback",
        },
        {
          name: "autoSlideInterval",
          type: "number",
          defaultValue: 4500,
          label: "Sliding Banner Rotation Speed (Milliseconds)",
          admin: {
            description: "Slide display duration in ms (e.g. 4500 for 4.5 seconds, 3000 for 3 seconds)",
          },
        },
        {
          name: "showOfficialBadge",
          type: "checkbox",
          defaultValue: true,
          label: "Show Official Store & Partner Badges on Banners",
        },
        {
          name: "bannerHoverPause",
          type: "checkbox",
          defaultValue: true,
          label: "Pause Banner Slide Rotation on Mouse Hover",
        },
        {
          name: "banners",
          type: "array",
          label: "Custom Hero Sliding Banners (Optional overrides)",
          labels: {
            singular: "Sliding Banner",
            plural: "Sliding Banners",
          },
          admin: {
            description:
              "Add custom sliding banners. If left empty, banners automatically adapt to the user's selected country.",
          },
          fields: [
            { name: "storeName", type: "text", required: true },
            { name: "title", type: "text", required: true },
            { name: "subtitle", type: "text" },
            { name: "code", type: "text", required: true },
            { name: "cashbackRate", type: "text", defaultValue: "Up to 8.5% CB" },
            { name: "storeRating", type: "text", defaultValue: "4.9/5" },
            { name: "successRate", type: "text", defaultValue: "98.6%" },
            { name: "countryCode", type: "text", admin: { description: "Optional country code (e.g. IN, UK, US). Leave blank for all countries." } },
            { name: "bannerImage", type: "text", admin: { description: "Optional URL/path to official promotional banner image (e.g. /banners/banner-amazon-uk.svg)" } },
            { name: "linkUrl", type: "text" },
          ],
        },
      ],
    },
    {
      name: "howItWorks",
      type: "group",
      label: "Homepage 'How It Works' Section",
      fields: [
        {
          name: "kicker",
          type: "text",
          defaultValue: "EASY AS 1, 2, 3",
        },
        {
          name: "title",
          type: "text",
          defaultValue: "How CouponKodee Works",
        },
        {
          name: "subtitle",
          type: "textarea",
          defaultValue:
            "Start saving in three easy steps with verified promo codes and automatic cashback tracking.",
        },
        {
          name: "steps",
          type: "array",
          label: "Steps",
          defaultValue: [
            {
              stepNumber: "01",
              title: "Find Your Store & Offer",
              description:
                "Browse 500+ top retailers. Click on any verified coupon or cashback link to activate savings.",
            },
            {
              stepNumber: "02",
              title: "Shop & Apply Code",
              description:
                "Shop directly on the retailer store as usual. Paste the copied promo code at checkout for instant discounts.",
            },
            {
              stepNumber: "03",
              title: "Withdraw Real Cashback",
              description:
                "Your cashback tracks automatically within 24–72 hours. Transfer confirmed earnings directly to your bank account or UPI.",
            },
          ],
          fields: [
            { name: "stepNumber", type: "text", required: true },
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
      ],
    },
    {
      name: "faqs",
      type: "group",
      label: "Frequently Asked Questions (Homepage FAQ)",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "Frequently Asked Questions",
        },
        {
          name: "subtitle",
          type: "textarea",
          defaultValue:
            "Everything you need to know about using CouponKodee, copying codes, and earning cashback.",
        },
        {
          name: "items",
          type: "array",
          label: "FAQ Questions & Answers",
          defaultValue: [
            {
              q: "How does CouponKodee Cashback work?",
              a: "When you click our link to visit a store and make a purchase, the retailer pays us an affiliate commission. Instead of keeping it all, we share the majority of this money directly with you as Cashback! Once confirmed, you can transfer your cashback directly to your bank account or UPI.",
            },
            {
              q: "Are the coupon codes and discounts completely free to use?",
              a: "Yes, 100% free! You never have to pay anything to use CouponKodee, copy coupon codes, or earn cashback. There are no hidden fees or subscription charges.",
            },
            {
              q: "Can I use a coupon code AND still earn cashback?",
              a: "Absolutely! In most cases, you can apply our verified promo codes at the store's checkout to get an immediate discount, and you will still earn CouponKodee cashback on the final payable amount.",
            },
            {
              q: "How long does it take for cashback to show in my account?",
              a: "Cashback usually tracks automatically within 24 to 72 hours as 'Pending'. Once the store's return/cancellation window closes (typically 30–60 days), the status updates to 'Confirmed' and is available for instant withdrawal.",
            },
            {
              q: "How do I withdraw my confirmed Cashback?",
              a: "Once your confirmed cashback balance reaches the minimum threshold of ₹100, you can request an instant payout via direct Bank Transfer (NEFT) or UPI.",
            },
          ],
          fields: [
            { name: "q", type: "text", label: "Question", required: true },
            { name: "a", type: "textarea", label: "Answer", required: true },
          ],
        },
      ],
    },
    {
      name: "newsletter",
      type: "group",
      label: "Homepage Newsletter Banner",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "Get the Best Deals in Your Inbox",
        },
        {
          name: "subtitle",
          type: "textarea",
          defaultValue:
            "Subscribe and never miss a verified coupon, fresh deal or cashback offer.",
        },
        {
          name: "buttonText",
          type: "text",
          defaultValue: "Subscribe",
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      label: "Company & Support Contact",
      fields: [
        { name: "supportEmail", type: "text", defaultValue: "support@couponkodee.com" },
        { name: "partnershipsEmail", type: "text", defaultValue: "partners@couponkodee.com" },
        { name: "supportPhone", type: "text", defaultValue: "+91 98765 43210" },
        {
          name: "address",
          type: "textarea",
          defaultValue: "CouponKodee Savings Network, Cyber City, Gurugram, India",
        },
      ],
    },
  ],
}

