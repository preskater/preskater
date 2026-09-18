"use server"

import { revalidatePath } from "next/cache"

import { requireCrmContext } from "@/lib/crm/context"
import {
  opportunityLineItemSchema,
  opportunitySchema,
  type OpportunityFormData,
} from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

function toData(values: OpportunityFormData) {
  return {
    name: values.name,
    accountId: values.accountId ?? null,
    ownerId: values.ownerId ?? null,
    stage: values.stage,
    amount: values.amount,
    probability: values.probability,
    closeDate: values.closeDate ?? null,
    description: values.description ?? null,
  }
}

export async function createOpportunity(
  values: Record<string, unknown>
): Promise<ActionResult> {
  await requireCrmContext()
  const parsed = opportunitySchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations de l'opportunité sont invalides.")
  }

  await prisma.opportunity.create({
    data: toData(parsed.data),
  })

  revalidatePath("/dashboard/opportunities")
  revalidatePath("/dashboard")
  return ok("Opportunité créée.")
}

export async function updateOpportunity(
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  await requireCrmContext()

  if (!id) return fail("Opportunité introuvable.")

  const parsed = opportunitySchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations de l'opportunité sont invalides.")
  }

  const existing = await prisma.opportunity.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Opportunité introuvable.")

  await prisma.opportunity.update({ where: { id }, data: toData(parsed.data) })

  revalidatePath("/dashboard/opportunities")
  revalidatePath(`/dashboard/opportunities/${id}`)
  return ok("Opportunité mise à jour.")
}

export async function deleteOpportunity(id: string): Promise<ActionResult> {
  await requireCrmContext()

  const existing = await prisma.opportunity.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Opportunité introuvable.")

  await prisma.opportunity.delete({ where: { id } })

  revalidatePath("/dashboard/opportunities")
  revalidatePath("/dashboard")
  return ok("Opportunité supprimée.")
}

export async function addOpportunityLineItem(
  values: Record<string, unknown>,
  opportunityId: string
): Promise<ActionResult> {
  await requireCrmContext()
  const parsed = opportunityLineItemSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Ligne de produit invalide.")
  }

  const opportunity = await prisma.opportunity.findFirst({
    where: { id: opportunityId },
    select: { id: true },
  })

  if (!opportunity) return fail("Opportunité introuvable.")

  await prisma.opportunityLineItem.create({
    data: {
      opportunityId,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
      unitPrice: parsed.data.unitPrice,
      discount: parsed.data.discount,
    },
  })

  revalidatePath(`/dashboard/opportunities/${opportunityId}`)
  return ok("Ligne ajoutée.")
}

export async function deleteOpportunityLineItem(
  id: string
): Promise<ActionResult> {
  await requireCrmContext()

  const item = await prisma.opportunityLineItem.findFirst({
    where: { id },
    select: { id: true, opportunityId: true },
  })

  if (!item) return fail("Ligne introuvable.")

  await prisma.opportunityLineItem.delete({ where: { id } })

  revalidatePath(`/dashboard/opportunities/${item.opportunityId}`)
  return ok("Ligne supprimée.")
}
