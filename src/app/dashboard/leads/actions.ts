"use server"

import { revalidatePath } from "next/cache"

import { requireCrmContext } from "@/lib/crm/context"
import { leadSchema, type LeadFormData } from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

function toData(values: LeadFormData) {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    company: values.company ?? null,
    email: values.email ?? null,
    phone: values.phone ?? null,
    jobTitle: values.jobTitle ?? null,
    source: values.source,
    status: values.status,
    estimatedValue: values.estimatedValue ?? null,
    notes: values.notes ?? null,
    ownerId: values.ownerId ?? null,
  }
}

export async function createLead(
  values: Record<string, unknown>
): Promise<ActionResult> {
  await requireCrmContext()
  const parsed = leadSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du prospect sont invalides.")
  }

  await prisma.lead.create({
    data: toData(parsed.data),
  })

  revalidatePath("/dashboard/leads")
  revalidatePath("/dashboard")
  return ok("Prospect créé.")
}

export async function updateLead(
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  await requireCrmContext()

  if (!id) return fail("Prospect introuvable.")

  const parsed = leadSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du prospect sont invalides.")
  }

  const existing = await prisma.lead.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Prospect introuvable.")

  await prisma.lead.update({ where: { id }, data: toData(parsed.data) })

  revalidatePath("/dashboard/leads")
  return ok("Prospect mis à jour.")
}

export async function deleteLead(id: string): Promise<ActionResult> {
  await requireCrmContext()

  const existing = await prisma.lead.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Prospect introuvable.")

  await prisma.lead.delete({ where: { id } })

  revalidatePath("/dashboard/leads")
  revalidatePath("/dashboard")
  return ok("Prospect supprimé.")
}

export async function convertLead(id: string): Promise<ActionResult> {
  await requireCrmContext()

  const lead = await prisma.lead.findFirst({
    where: { id },
  })

  if (!lead) return fail("Prospect introuvable.")
  if (lead.status === "CONVERTED" || lead.convertedAt) {
    return fail("Ce prospect a déjà été converti.")
  }

  await prisma.$transaction(async (tx) => {
    const account = await tx.crmAccount.create({
      data: {
        name: lead.company ?? `${lead.firstName} ${lead.lastName}`,
        type: "PROSPECT",
        ownerId: lead.ownerId,
      },
    })

    const contact = await tx.contact.create({
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        jobTitle: lead.jobTitle,
        accountId: account.id,
        ownerId: lead.ownerId,
      },
    })

    const opportunity = await tx.opportunity.create({
      data: {
        name: `${lead.company ?? `${lead.firstName} ${lead.lastName}`} — opportunité`,
        accountId: account.id,
        ownerId: lead.ownerId,
        stage: "PROSPECTING",
        amount: lead.estimatedValue ?? 0,
        probability: 20,
        description: lead.notes,
      },
    })

    await tx.opportunityContactRole.create({
      data: {
        opportunityId: opportunity.id,
        contactId: contact.id,
        role: "DECISION_MAKER",
        isPrimary: true,
      },
    })

    await tx.lead.update({
      where: { id },
      data: {
        status: "CONVERTED",
        convertedAt: new Date(),
        convertedAccountId: account.id,
        convertedContactId: contact.id,
        convertedOpportunityId: opportunity.id,
      },
    })
  })

  revalidatePath("/dashboard/leads")
  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard/contacts")
  revalidatePath("/dashboard/opportunities")
  revalidatePath("/dashboard")
  return ok("Prospect converti en compte, contact et opportunité.")
}
