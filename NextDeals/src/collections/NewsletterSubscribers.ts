import type { CollectionConfig } from "payload"

export const NewsletterSubscribers: CollectionConfig = {
  slug: "newsletter-subscribers",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "isActive", "createdAt"],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "preferences",
      type: "group",
      fields: [
        {
          name: "categories",
          type: "relationship",
          relationTo: "categories",
          hasMany: true,
          admin: {
            description: "Categories user is interested in",
          },
        },
        {
          name: "frequency",
          type: "select",
          options: [
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
          ],
          defaultValue: "weekly",
        },
      ],
    },
    {
      name: "source",
      type: "select",
      options: [
        { label: "Website Signup", value: "website" },
        { label: "Social Media", value: "social" },
        { label: "Referral", value: "referral" },
        { label: "Advertisement", value: "ad" },
      ],
      defaultValue: "website",
    },
  ],
  timestamps: true,
}

 
