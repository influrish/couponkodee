import type { CollectionConfig } from "payload"

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "currentPrice", "category", "isFeatured", "updatedAt"],
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
        description: "Product name/title",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly version of the title",
      },
    },
    {
      name: "description",
      type: "richText",
      admin: {
        description: "Full product description",
      },
    },
    {
      name: "shortDescription",
      type: "textarea",
      admin: {
        description: "Brief description for cards and previews",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    {
      name: "store",
      type: "relationship",
      relationTo: "stores",
      admin: {
        description: "Select partner store for this deal (optional)",
      },
    },
    {
      name: "brand",
      type: "text",
    },
    {
      name: "model",
      type: "text",
    },
    {
      name: "sku",
      type: "text",
      admin: {
        description: "Stock Keeping Unit",
      },
    },
    {
      name: "pricing",
      type: "group",
      fields: [
        {
          name: "originalPrice",
          type: "number",
          required: true,
          admin: {
            step: 0.01,
          },
        },
        {
          name: "currentPrice",
          type: "number",
          required: true,
          admin: {
            step: 0.01,
          },
        },
        {
          name: "discountPercentage",
          type: "number",
          admin: {
            readOnly: true,
            description: "Automatically calculated",
          },
        },
      ],
    },
    {
      name: "rating",
      type: "number",
      min: 0,
      max: 5,
      admin: {
        step: 0.1,
      },
    },
    {
      name: "reviewCount",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "images",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "alt",
          type: "text",
          required: false,
          defaultValue: "Deal Image",
        },
      ],
    },
    {
      name: "affiliateUrl",
      type: "text",
      required: true,
      admin: {
        description: "Affiliate link to the product",
      },
    },
    {
      name: "merchant",
      type: "text",
      required: true,
      admin: {
        description: "Store name / slug (e.g. amazon, flipkart, myntra, tata-1mg, etc.)",
      },
    },
    {
      name: "features",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "value",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "status",
      type: "group",
      fields: [
        {
          name: "isFeatured",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Show on homepage featured section",
          },
        },
        {
          name: "isTrending",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Show in trending section",
          },
        },
        {
          name: "isVerified",
          type: "checkbox",
          defaultValue: true,
          admin: {
            description: "Show verified price drop badge",
          },
        },
        {
          name: "isActive",
          type: "checkbox",
          defaultValue: true,
          admin: {
            description: "Product is active and visible",
          },
        },
      ],
    },
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "keywords",
          type: "text",
        },
      ],
    },
    {
      name: "analytics",
      type: "group",
      fields: [
        {
          name: "viewCount",
          type: "number",
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: "clickCount",
          type: "number",
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: "conversionRate",
          type: "number",
          admin: {
            readOnly: true,
            step: 0.01,
          },
        },
        {
          name: "lastViewedAt",
          type: "date",
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate slug from title
        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        }

        // Calculate discount percentage
        if (data.pricing?.originalPrice && data.pricing?.currentPrice) {
          const discount = ((data.pricing.originalPrice - data.pricing.currentPrice) / data.pricing.originalPrice) * 100
          data.pricing.discountPercentage = Math.round(discount)
        }

        // Calculate conversion rate
        if (data.analytics?.viewCount && data.analytics?.clickCount) {
          data.analytics.conversionRate = (data.analytics.clickCount / data.analytics.viewCount) * 100
        }

        return data
      },
    ],
  },
}
