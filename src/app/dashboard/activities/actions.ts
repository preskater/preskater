"use server"

import { revalidatePath } from "next/cache"

import { requireCrmContext } from "@/lib/crm/context"
import { activitySchema, type ActivityFormData } from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

function toData(values: ActivityFormData, userId: string) {
  return {
    type: values.type,
    subject: values.subject,
    notes: values.notes ?? null,
    occurredAt: values.occurredAt ?? new Date(),
    userId,
    accountId: values.accountId ?? null,
    contactId: values.contactId ?? null,
    opportunityId: values.opportunityId ?? null,
    leadId: values.leadId ?? null,
    orderId: values.orderId ?? null,
  }
}

function revalidateRelated(values: Record<string, unknown>) {
  revalidatePath("/dashboard/activities")
  if (values.accountId) revalidatePath(`/dashboard/accounts/${values.accountId}`)
  if (values.opportunityId)
    revalidatePath(`/dashboard/opportunities/${values.opportunityId}`)
}

export async function createActivity(
  values: Record<string, unknown>
): Promise<ActionResult> {
  const context = await requireCrmContext()
  const parsed = activitySchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations de l'activité sont invalides.")
  }

  await prisma.activity.create({
    data: {
      ...toData(parsed.data, context.user.id),
      organizationId: context.organizationId,
    },
  })

  revalidateRelated(values)
  return ok("Activité enregistrée.")
}

export async function updateActivity(
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  const context = await requireCrmContext()

  if (!id) return fail("Activité introuvable.")

  const parsed = activitySchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations de l'activité sont invalides.")
  }

  const existing = await prisma.activity.findFirst({
    where: { id, organizationId: context.organizationId },
    select: { id: true, userId: true },
  })

  if (!existing) return fail("Activité introuvable.")

  await prisma.activity.update({
    where: { id },
    data: toData(parsed.data, existing.userId ?? context.user.id),
  })

  revalidateRelated(values)
  return ok("Activité mise à jour.")
}

export async function deleteActivity(id: string): Promise<ActionResult> {
  const context = await requireCrmContext()

  const existing = await prisma.activity.findFirst({
    where: { id, organizationId: context.organizationId },
    select: { id: true },
  })

  if (!existing) return fail("Activité introuvable.")

  await prisma.activity.delete({ where: { id } })

  revalidatePath("/dashboard/activities")
  return ok("Activité supprimée.")
}
