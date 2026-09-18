"use server"

import { revalidatePath } from "next/cache"

import {
  canManage,
  requireAdminContext,
  requireCrmContext,
} from "@/lib/crm/context"
import { employeeSchema, type EmployeeFormData } from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

function toData(values: EmployeeFormData) {
  return {
    name: values.name,
    role: values.role,
    department: values.department,
    jobTitle: values.jobTitle ?? null,
    phone: values.phone ?? null,
    managerId: values.managerId ?? null,
  }
}

export async function updateEmployee(
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  const context = await requireCrmContext()

  if (!canManage(context)) {
    return fail("Vous n'avez pas les droits pour modifier les employés.")
  }

  if (!id) return fail("Employé introuvable.")

  const parsed = employeeSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations de l'employé sont invalides.")
  }

  const membership = await prisma.member.findFirst({
    where: { userId: id, organizationId: context.organizationId },
    select: { id: true },
  })

  if (!membership) return fail("Employé introuvable dans cette organisation.")

  await prisma.user.update({ where: { id }, data: toData(parsed.data) })

  revalidatePath("/dashboard/employees")
  return ok("Employé mis à jour.")
}

export async function setMemberRole(
  memberId: string,
  role: "owner" | "admin" | "member"
): Promise<ActionResult> {
  const context = await requireAdminContext()

  const member = await prisma.member.findFirst({
    where: { id: memberId, organizationId: context.organizationId },
  })

  if (!member) return fail("Membre introuvable.")

  if (member.role === "owner") {
    return fail("Le rôle du propriétaire ne peut pas être modifié ici.")
  }

  await prisma.member.update({ where: { id: memberId }, data: { role } })

  revalidatePath("/dashboard/employees")
  revalidatePath("/dashboard/settings/organization")
  return ok("Rôle mis à jour.")
}

export async function removeMember(memberId: string): Promise<ActionResult> {
  const context = await requireAdminContext()

  const member = await prisma.member.findFirst({
    where: { id: memberId, organizationId: context.organizationId },
  })

  if (!member) return fail("Membre introuvable.")

  if (member.role === "owner") {
    return fail("Le propriétaire ne peut pas être retiré.")
  }

  if (member.userId === context.user.id) {
    return fail("Vous ne pouvez pas vous retirer vous-même.")
  }

  await prisma.member.delete({ where: { id: memberId } })

  revalidatePath("/dashboard/employees")
  revalidatePath("/dashboard/settings/organization")
  return ok("Membre retiré de l'organisation.")
}
