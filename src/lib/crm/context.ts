import "server-only"

import { headers } from "next/headers"

import { auth } from "@/lib/auth"

export type CrmContext = {
  user: {
    id: string
    name: string
    email: string
    role: string
    department: string | null
    mustChangePassword: boolean
  }
}

export async function getCrmContext(): Promise<CrmContext | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return null
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role ?? "AGENT",
      department: session.user.department ?? null,
      mustChangePassword: session.user.mustChangePassword ?? false,
    },
  }
}

export async function requireCrmContext(): Promise<CrmContext> {
  const context = await getCrmContext()

  if (!context) {
    throw new Error("UNAUTHORIZED")
  }

  return context
}

export function isAdmin(context: CrmContext) {
  return context.user.role === "ADMIN"
}

export function canManage(context: CrmContext) {
  return isAdmin(context) || context.user.role === "MANAGER"
}

export async function requireAdminContext(): Promise<CrmContext> {
  const context = await requireCrmContext()

  if (!isAdmin(context)) {
    throw new Error("FORBIDDEN")
  }

  return context
}
