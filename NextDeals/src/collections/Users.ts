import type { CollectionConfig } from "payload"
import { isAdmin, isAdminField, isAdminOrSelf, isStaffRequest } from "../access/roles"

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    // Only admins and editors may open the /admin panel; shoppers use the storefront.
    admin: ({ req }) => isStaffRequest(req),
    read: isAdminOrSelf,
    // Public sign-up goes through /api/auth/register, which uses the local API.
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
        {
          label: "User",
          value: "user",
        },
      ],
      defaultValue: "user",
      required: true,
      saveToJWT: true,
      access: {
        // Prevents self-promotion via PATCH /api/users/:id
        create: isAdminField,
        update: isAdminField,
      },
    },
  ],
}
