import type { CollectionConfig } from "payload"

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "parent", "productCount", "updatedAt"],
    listSearchableFields: ["name", "description"],
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
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly version of the name",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "shortDescription",
      type: "text",
      admin: {
        description: "Brief description for cards",
      },
    },
    {
      name: "icon",
      type: "select",
      options: [
        { label: "Smartphone", value: "smartphone" },
        { label: "Laptop", value: "laptop" },
        { label: "Headphones", value: "headphones" },
        { label: "Camera", value: "camera" },
        { label: "Home", value: "home" },
        { label: "Sofa", value: "sofa" },
        { label: "Kitchen", value: "kitchen" },
        { label: "Garden", value: "garden" },
        { label: "Shirt", value: "shirt" },
        { label: "Shoes", value: "shoes" },
        { label: "Watch", value: "watch" },
        { label: "Bag", value: "bag" },
        { label: "Heart", value: "heart" },
        { label: "Sparkles", value: "sparkles" },
        { label: "Dumbbell", value: "dumbbell" },
        { label: "Activity", value: "activity" },
        { label: "Book", value: "book" },
        { label: "Music", value: "music" },
      ],
      defaultValue: "smartphone",
    },
    {
      name: "color",
      type: "select",
      options: [
        { label: "Blue", value: "blue" },
        { label: "Green", value: "green" },
        { label: "Purple", value: "purple" },
        { label: "Pink", value: "pink" },
        { label: "Orange", value: "orange" },
        { label: "Indigo", value: "indigo" },
        { label: "Red", value: "red" },
        { label: "Yellow", value: "yellow" },
      ],
      defaultValue: "blue",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      admin: {
        description: "Parent category for subcategories",
      },
    },
    {
      name: "level",
      type: "number",
      admin: {
        readOnly: true,
        description: "Category depth level (0 = root, 1 = subcategory, etc.)",
      },
      defaultValue: 0,
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Show in featured categories section",
      },
    },
    {
      name: "productCount",
      type: "number",
      admin: {
        readOnly: true,
        description: "Automatically calculated",
      },
      defaultValue: 0,
    },
    {
      name: "subcategoryCount",
      type: "number",
      admin: {
        readOnly: true,
        description: "Number of subcategories",
      },
      defaultValue: 0,
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Display order (lower numbers first)",
      },
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
      name: "viewCount",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: "Page view count for analytics",
      },
    },
    {
      name: "lastViewedAt",
      type: "date",
      admin: {
        readOnly: true,
        description: "Last time this category was viewed",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-generate slug from name
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        }

        // Calculate category level based on parent
        if (data.parent) {
          try {
            const parent = await req.payload.findByID({
              collection: "categories",
              id: data.parent,
            })
            data.level = (parent.level || 0) + 1
          } catch (error) {
            data.level = 1
          }
        } else {
          data.level = 0
        }

        return data
      },
    ],
  },
} 
