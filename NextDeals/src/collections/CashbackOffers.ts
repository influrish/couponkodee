import type { CollectionConfig } from "payload"
import { publicContentAccess } from "../access/roles"

export const CashbackOffers: CollectionConfig = {
  slug: "cashback-offers",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "merchant", "cashbackRate", "isFeatured", "isVerified", "isActive", "updatedAt"],
    listSearchableFields: ["title", "description", "merchant", "cashbackRate"],
  },
  access: publicContentAccess,
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Offer headline (e.g. 'Earn Up to 8.5% Cashback on All Fashion Orders')",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Description of the cashback opportunity and rewards",
      },
    },
    {
      name: "store",
      type: "relationship",
      relationTo: "stores",
      admin: {
        description: "Select the partner store offering this cashback",
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
      name: "cashbackRate",
      type: "text",
      required: true,
      admin: {
        description: "Cashback rate label (e.g. 'Up to 8.5% Cashback', 'Flat ₹50 Cashback')",
      },
    },
    {
      name: "cashbackTerms",
      type: "textarea",
      admin: {
        description: "Tracking rules, payout timelines and conditions",
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
        description: "Department category for grouping",
      },
    },
    {
      name: "affiliateUrl",
      type: "text",
      required: true,
      admin: {
        description: "Affiliate tracking activation URL",
      },
    },
    {
      name: "expiresAt",
      type: "date",
      admin: {
        description: "Optional rate validity or campaign expiry date",
      },
    },
    {
      name: "isVerified",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Mark as 100% verified real cash offer",
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Show on Homepage in 'Top Cashback Offers Today' section",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Offer is currently active and valid",
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
