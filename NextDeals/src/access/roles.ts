import type { Access, FieldAccess, PayloadRequest } from "payload"

export type UserRole = "admin" | "editor" | "user"

const STAFF_ROLES: UserRole[] = ["admin", "editor"]

function getRole(req: PayloadRequest): UserRole | undefined {
  return (req.user as { role?: UserRole } | null | undefined)?.role
}

export function isStaffRequest(req: PayloadRequest): boolean {
  const role = getRole(req)
  return Boolean(role && STAFF_ROLES.includes(role))
}

/** Anyone, including anonymous visitors. */
export const anyone: Access = () => true

/** Admins and editors: everyone allowed to manage store content. */
export const isStaff: Access = ({ req }) => isStaffRequest(req)

/** Admins only. */
export const isAdmin: Access = ({ req }) => getRole(req) === "admin"

export const isAdminField: FieldAccess = ({ req }) => getRole(req) === "admin"

/** Admins see/edit every user; everyone else only their own record. */
export const isAdminOrSelf: Access = ({ req }) => {
  if (getRole(req) === "admin") return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}

/** Standard access for CMS-managed, publicly readable content. */
export const publicContentAccess = {
  read: anyone,
  create: isStaff,
  update: isStaff,
  delete: isStaff,
}
