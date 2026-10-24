import type { CollectionConfig } from "payload"
import { isStaff } from "../access/roles"

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["subject", "email", "status", "createdAt"],
    description: "Messages sent from the website contact form.",
  },
  access: {
    read: isStaff,
    // Submissions go through /api/contact (validated + rate limited), not the REST API.
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true, index: true },
    { name: "subject", type: "text", required: true },
    { name: "message", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "In Progress", value: "in-progress" },
        { label: "Resolved", value: "resolved" },
      ],
    },
  ],
  timestamps: true,
}
