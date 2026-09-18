"use server"

import { revalidatePath } from "next/cache"

import { requireCrmContext } from "@/lib/crm/context"
import { contactSchema, type ContactFormData } from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

function toData(values: ContactFormData) {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email ?? null,
    phone: values.phone ?? null,
    mobile: values.mobile ?? null,
    jobTitle: values.jobTitle ?? null,
    address: values.address ?? null,
    city: values.city ?? null,
    state: values.state ?? null,
    country: values.country ?? null,
    postalCode: values.postalCode ?? null,
    notes: values.notes ?? null,
    accountId: values.accountId ?? null,
    ownerId: values.ownerId ?? null,
  }
}

export async function createContact(
  values: Record<string, unknown>
): Promise<ActionResult> {
  await requireCrmContext()
  const parsed = contactSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du contact sont invalides.")
  }

  await prisma.contact.create({
    data: toData(parsed.data),
  })

  revalidatePath("/dashboard/contacts")
  revalidatePath("/dashboard")
  return ok("Contact créé.")
}

export async function updateContact(
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  await requireCrmContext()

  if (!id) return fail("Contact introuvable.")

  const parsed = contactSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du contact sont invalides.")
  }

  const existing = await prisma.contact.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Contact introuvable.")

  await prisma.contact.update({ where: { id }, data: toData(parsed.data) })

  revalidatePath("/dashboard/contacts")
  return ok("Contact mis à jour.")
}

export async function deleteContact(id: string): Promise<ActionResult> {
  await requireCrmContext()

  const existing = await prisma.contact.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Contact introuvable.")

  await prisma.contact.delete({ where: { id } })

  revalidatePath("/dashboard/contacts")
  revalidatePath("/dashboard")
  return ok("Contact supprimé.")
}
