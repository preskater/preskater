"use server"

import { revalidatePath } from "next/cache"

import { requireCrmContext } from "@/lib/crm/context"
import { serviceSchema, type ServiceFormData } from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

function toData(values: ServiceFormData) {
  return {
    name: values.name,
    description: values.description ?? null,
    price: values.price,
    status: values.status,
    productId: values.productId ?? null,
  }
}

export async function createService(
  values: Record<string, unknown>
): Promise<ActionResult> {
  const context = await requireCrmContext()
  const parsed = serviceSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du service sont invalides.")
  }

  await prisma.service.create({
    data: { ...toData(parsed.data), organizationId: context.organizationId },
  })

  revalidatePath("/dashboard/services")
  revalidatePath("/dashboard")
  return ok("Service créé.")
}

export async function updateService(
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  const context = await requireCrmContext()

  if (!id) return fail("Service introuvable.")

  const parsed = serviceSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du service sont invalides.")
  }

  const existing = await prisma.service.findFirst({
    where: { id, organizationId: context.organizationId },
    select: { id: true },
  })

  if (!existing) return fail("Service introuvable.")

  await prisma.service.update({ where: { id }, data: toData(parsed.data) })

  revalidatePath("/dashboard/services")
  return ok("Service mis à jour.")
}

export async function deleteService(id: string): Promise<ActionResult> {
  const context = await requireCrmContext()

  const existing = await prisma.service.findFirst({
    where: { id, organizationId: context.organizationId },
    select: { id: true },
  })

  if (!existing) return fail("Service introuvable.")

  await prisma.service.delete({ where: { id } })

  revalidatePath("/dashboard/services")
  revalidatePath("/dashboard")
  return ok("Service supprimé.")
}
