import type { CollectionConfig } from "payload"

export const PriceHistory: CollectionConfig = {
  slug: "price-history",
  admin: {
    useAsTitle: "product",
    defaultColumns: ["product", "price", "createdAt"],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  // MongoDB indexes for time-series data optimization
  // indexes: [
  //   {
  //     fields: {
  //       product: 1,
  //       createdAt: -1,
  //     },
  //   },
  //   {
  //     fields: {
  //       createdAt: -1,
  //     },
  //   },
  //   {
  //     fields: {
  //       product: 1,
  //       price: 1,
  //     },
  //   },
  // ],
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      index: true,
    },
    {
      name: "price",
      type: "number",
      required: true,
      index: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: "source",
      type: "select",
      options: [
        { label: "Manual Entry", value: "manual" },
        { label: "API Scrape", value: "api" },
        { label: "CSV Import", value: "csv" },
        { label: "Scheduled Task", value: "scheduled" },
      ],
      defaultValue: "manual",
      index: true,
    },
    {
      name: "priceChange",
      type: "number",
      admin: {
        readOnly: true,
        description: "Price change from previous entry",
        step: 0.01,
      },
    },
    {
      name: "priceChangePercentage",
      type: "number",
      admin: {
        readOnly: true,
        description: "Percentage change from previous entry",
        step: 0.01,
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === "create" && data.product) {
          // Get the last price entry for this product
          const lastEntry = await req.payload.find({
            collection: "price-history",
            where: {
              product: {
                equals: data.product,
              },
            },
            sort: "-createdAt",
            limit: 1,
          })

          if (lastEntry.docs.length > 0) {
            const lastPrice = lastEntry.docs[0].price
            data.priceChange = data.price - lastPrice
            data.priceChangePercentage = ((data.price - lastPrice) / lastPrice) * 100
          }
        }

        return data
      },
    ],
  },
}
