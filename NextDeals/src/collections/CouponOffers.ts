import type { CollectionConfig } from "payload"

export const CouponOffers: CollectionConfig = {
  slug: "coupon-offers",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "merchant", "code", "discount", "isFeatured", "isVerified", "isActive", "updatedAt"],
    listSearchableFields: ["title", "description", "merchant", "code"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Offer headline (e.g. 'Flat 20% Off on Prescription Medicines')",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Terms, validity details, or minimum purchase requirements",
      },
    },
    {
      name: "store",
      type: "relationship",
      relationTo: "stores",
      admin: {
        description: "Select the partner store this coupon belongs to",
      },
    },
    {
      name: "merchant",
      type: "text",
      required: true,
      admin: {
        description: "Store name (e.g. Amazon, Myntra, Swiggy)",
      },
    },
    {
      name: "merchantSlug",
      type: "text",
      admin: {
        description: "URL slug of the store (e.g. amazon, myntra)",
      },
    },
    {
      name: "category",
      type: "select",
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
        description: "Category for filtering on coupons page",
      },
    },
    {
      name: "code",
      type: "text",
      required: true,
      admin: {
        description: "Promo / coupon code that shoppers copy (e.g. AMZTECH10)",
      },
    },
    {
      name: "discount",
      type: "text",
      required: true,
      admin: {
        description: "Discount badge text (e.g. '20% OFF', 'FLAT ₹500')",
      },
    },
    {
      name: "affiliateUrl",
      type: "text",
      required: true,
      admin: {
        description: "Direct tracking link with your affiliate tags",
      },
    },
    {
      name: "expiresAt",
      type: "date",
      admin: {
        description: "Coupon expiration date (optional)",
      },
    },
    {
      name: "isVerified",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Display 'Verified' badge on the coupon card",
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Show on the Homepage in 'Best Coupons & Promo Codes' section",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Is this offer currently valid? (Uncheck if expired)",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Higher numbers appear first",
      },
    },
  ],
}
