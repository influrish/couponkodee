import type { CollectionConfig } from "payload"

export const Stores: CollectionConfig = {
  slug: "stores",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "cashbackRate", "isPopular", "isVerified", "isActive", "updatedAt"],
    listSearchableFields: ["name", "slug", "description", "categoryName"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "Store or brand name (e.g. Amazon, Flipkart, Myntra)",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly identifier (e.g. amazon, flipkart, myntra)",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "electronics",
      options: [
        { label: "Fashion & Apparel", value: "fashion" },
        { label: "Mobiles & Electronics", value: "electronics" },
        { label: "Food & Dining", value: "food" },
        { label: "Travel & Flights", value: "travel" },
        { label: "Beauty & Wellness", value: "beauty" },
        { label: "Home & Living", value: "home" },
        { label: "Grocery & Essentials", value: "grocery" },
      ],
      admin: {
        description: "Primary shopping category department",
      },
    },
    {
      name: "categoryName",
      type: "text",
      admin: {
        description: "Human-readable department name (e.g. Fashion & Apparel)",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: {
        description: "Full store description, savings overview and shopping tips",
      },
    },
    {
      name: "initial",
      type: "text",
      maxLength: 2,
      defaultValue: "S",
      admin: {
        description: "1-letter logo placeholder (e.g. 'A' for Amazon, 'F' for Flipkart)",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Upload store logo image file directly (saved permanently to media library)",
      },
    },
    {
      name: "customLogoUrl",
      type: "text",
      admin: {
        description: "Direct store logo URL or relative path (e.g. /logos/lenskart.jpg, /logos/ajio.jpg, or external https://...). Overrides default icon across mobile & desktop.",
      },
    },
    {
      name: "bg",
      type: "text",
      defaultValue: "bg-slate-900",
      admin: {
        description: "Store avatar background color class (e.g. bg-amber-500, bg-blue-600, bg-rose-500)",
      },
    },
    {
      name: "affiliateUrl",
      type: "text",
      required: true,
      admin: {
        description: "Base affiliate tracking URL for redirection (e.g. https://www.amazon.in/?tag=youraffid)",
      },
    },
    {
      name: "cashbackRate",
      type: "text",
      admin: {
        description: "Active cashback rate (e.g. 'Up to 5.0% Cashback' or 'Flat ₹150 Cashback')",
      },
    },
    {
      name: "cashbackTerms",
      type: "textarea",
      admin: {
        description: "Cashback terms and conditions (e.g. Valid on all orders. Tracks within 24 hours.)",
      },
    },
    {
      name: "couponsCount",
      type: "number",
      defaultValue: 10,
      admin: {
        description: "Display count of active offers and promo codes",
      },
    },
    {
      name: "isPopular",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Show in 'Popular Stores' on homepage and top filter buttons",
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Highlight as featured partner brand across the site",
      },
    },
    {
      name: "hasCashback",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Store offers real bank-transferable cashback",
      },
    },
    {
      name: "hasCoupons",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Store has active coupon promo codes",
      },
    },
    {
      name: "isVerified",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Show verified merchant trust badge",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Store is active and visible on the website",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Custom sorting priority (higher numbers appear first)",
      },
    },
  ],
}
