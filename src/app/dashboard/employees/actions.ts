"use server"

import { revalidatePath } from "next/cache"

import { canManage, requireCrmContext } from "@/lib/crm/context"
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

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!user) return fail("Employé introuvable.")

  await prisma.user.update({ where: { id }, data: toData(parsed.data) })

  revalidatePath("/dashboard/employees")
  return ok("Employé mis à jour.")
}
