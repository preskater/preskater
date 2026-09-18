import "server-only"

import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export type CrmContext = {
  user: {
    id: string
    name: string
    email: string
    role: string
    department: string | null
  }
  organizationId: string
  organizationName: string
  organizationSlug: string
  memberRole: string
}

export async function getCrmContext(): Promise<CrmContext | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return null
  }

  const memberships = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  })

  if (memberships.length === 0) {
    return null
  }

  const activeId = session.session.activeOrganizationId
  const membership =
    memberships.find((item) => item.organizationId === activeId) ??
    memberships[0]

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role ?? "AGENT",
      department: session.user.department ?? null,
    },
    organizationId: membership.organizationId,
    organizationName: membership.organization.name,
    organizationSlug: membership.organization.slug,
    memberRole: membership.role,
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
  return (
    context.user.role === "ADMIN" ||
    context.memberRole === "owner" ||
    context.memberRole === "admin"
  )
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
