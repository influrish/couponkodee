import type { CollectionConfig } from "payload"
import { publicContentAccess } from "../access/roles"

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "isPublished", "updatedAt"],
  },
  access: publicContentAccess,
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Page heading (e.g. 'About Us', 'Privacy Policy')",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL path slug (e.g. 'about', 'privacy', 'terms', 'contact')",
      },
    },
    {
      name: "subtitle",
      type: "text",
      admin: {
        description: "Optional brief subtitle under page title",
      },
    },
    {
      name: "body",
      type: "textarea",
      required: true,
      admin: {
        description: "Full body content of this page. Supports text, markdown, or HTML.",
      },
    },
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: true,
      label: "Published (Visible on site)",
    },
    {
      name: "metaTitle",
      type: "text",
      admin: {
        description: "SEO Meta Title",
      },
    },
    {
      name: "metaDescription",
      type: "textarea",
      admin: {
        description: "SEO Meta Description",
      },
    },
  ],
}

