import type { GlobalConfig } from "payload"

export const Header: GlobalConfig = {
  slug: "header",
  label: "Header & Navigation",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "brand",
      type: "group",
      label: "Brand & Logo",
      fields: [
        {
          name: "brandName",
          type: "text",
          defaultValue: "Coupon",
          required: true,
          admin: {
            description: "First part of the logo text (e.g. 'Coupon')",
          },
        },
        {
          name: "brandHighlight",
          type: "text",
          defaultValue: "Kodee",
          required: true,
          admin: {
            description: "Highlighted part of the logo text (e.g. 'Kodee')",
          },
        },
        {
          name: "customLogoUrl",
          type: "text",
          admin: {
            description: "Optional URL for custom image logo (overrides text logo if provided)",
          },
        },
      ],
    },
    {
      name: "appearance",
      type: "group",
      label: "Header Formatting & Colors",
      fields: [
        {
          name: "navbarBg",
          type: "select",
          defaultValue: "white",
          label: "Header Bar Background Theme",
          options: [
            { label: "Clean White (Default)", value: "white" },
            { label: "Soft Slate (#F8FAFC)", value: "slate" },
            { label: "Midnight Dark (#0F172A)", value: "dark" },
            { label: "Transparent Glass Blur", value: "transparent" },
            { label: "Custom Hex Color", value: "custom" },
          ],
        },
        {
          name: "customBgColor",
          type: "text",
          label: "Custom Header Background Hex (e.g. #ffffff)",
          admin: {
            description: "Used when 'Custom Hex Color' is selected above",
          },
        },
        {
          name: "accentColor",
          type: "select",
          defaultValue: "purple",
          label: "Brand Accent & Link Hover Color",
          options: [
            { label: "Royal Purple (Default)", value: "purple" },
            { label: "Emerald Green", value: "emerald" },
            { label: "Indigo Blue", value: "indigo" },
            { label: "Vibrant Orange", value: "orange" },
            { label: "Ocean Blue", value: "blue" },
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
          name: "announcementBg",
          type: "select",
          defaultValue: "purple-gradient",
          label: "Top Announcement Bar Theme",
          options: [
            { label: "Purple Gradient (Default)", value: "purple-gradient" },
            { label: "Emerald Green", value: "emerald" },
            { label: "Warm Amber / Gold", value: "amber" },
            { label: "Midnight Dark", value: "dark" },
            { label: "Custom Hex Color", value: "custom" },
          ],
        },
        {
          name: "customAnnouncementBg",
          type: "text",
          label: "Custom Announcement Bar Background Hex (e.g. #4f46e5)",
        },
        {
          name: "customAnnouncementTextColor",
          type: "text",
          label: "Custom Announcement Bar Text Hex (e.g. #ffffff)",
        },
      ],
    },
    {
      name: "announcement",
      type: "group",
      label: "Top Announcement Bar",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          defaultValue: false,
          label: "Show Announcement Bar at top of page",
        },
        {
          name: "text",
          type: "text",
          defaultValue: "🎉 Special: Extra Cashback on all partner stores today!",
          admin: {
            description: "Notice message displayed in the top banner",
          },
        },
        {
          name: "link",
          type: "text",
          defaultValue: "/cashback",
          admin: {
            description: "Optional destination link for the announcement",
          },
        },
        {
          name: "badge",
          type: "text",
          defaultValue: "Special Offer",
        },
      ],
    },
    {
      name: "search",
      type: "group",
      label: "Search Bar Settings",
      fields: [
        {
          name: "placeholder",
          type: "text",
          defaultValue: "Search 500+ stores, coupons or deals...",
          admin: {
            description: "Input placeholder text inside the header search bar",
          },
        },
        {
          name: "buttonText",
          type: "text",
          defaultValue: "Search",
        },
      ],
    },
    {
      name: "menuItems",
      type: "array",
      label: "Main Navigation Menu Items",
      labels: {
        singular: "Menu Item",
        plural: "Menu Items",
      },
      defaultValue: [
        { label: "Home", url: "/" },
        { label: "Stores", url: "/stores" },
        { label: "Categories", url: "/categories" },
        { label: "Coupons", url: "/coupons" },
        { label: "Deals", url: "/deals" },
        { label: "Cashback", url: "/cashback", badge: "Extra Cash", isCashback: true },
      ],
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          admin: {
            description: "Visible menu title (e.g. 'Stores', 'Coupons')",
          },
        },
        {
          name: "url",
          type: "text",
          required: true,
          admin: {
            description: "Destination URL (e.g. '/stores', '/deals')",
          },
        },
        {
          name: "badge",
          type: "text",
          admin: {
            description: "Optional badge label (e.g. 'Hot', 'Extra Cash', 'New')",
          },
        },
        {
          name: "isCashback",
          type: "checkbox",
          label: "Highlight with green cashback badge style",
          defaultValue: false,
        },
        {
          name: "openInNewTab",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
    {
      name: "features",
      type: "group",
      label: "Header Controls & CTAs",
      fields: [
        {
          name: "showCountrySelector",
          type: "checkbox",
          defaultValue: true,
          label: "Show Country / Region Switcher in Header",
        },
        {
          name: "showSearch",
          type: "checkbox",
          defaultValue: true,
          label: "Show Search Bar in Header",
        },
        {
          name: "loginLabel",
          type: "text",
          defaultValue: "Sign In",
        },
        {
          name: "signupLabel",
          type: "text",
          defaultValue: "Join Free",
        },
      ],
    },
  ],
}

