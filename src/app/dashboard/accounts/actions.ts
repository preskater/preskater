"use server"

import { revalidatePath } from "next/cache"

import { requireCrmContext } from "@/lib/crm/context"
import { accountSchema, type AccountFormData } from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

function toData(values: AccountFormData) {
  return {
    name: values.name,
    type: values.type,
    industry: values.industry ?? null,
    website: values.website ?? null,
    phone: values.phone ?? null,
    email: values.email ?? null,
    address: values.address ?? null,
    city: values.city ?? null,
    state: values.state ?? null,
    country: values.country ?? null,
    postalCode: values.postalCode ?? null,
    annualRevenue: values.annualRevenue ?? null,
    employeeCount: values.employeeCount ?? null,
    description: values.description ?? null,
    ownerId: values.ownerId ?? null,
  }
}

export async function createAccount(
  values: Record<string, unknown>
): Promise<ActionResult> {
  await requireCrmContext()
  const parsed = accountSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du compte sont invalides.")
  }

  await prisma.crmAccount.create({
    data: toData(parsed.data),
  })

  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard")
  return ok("Compte créé.")
}

export async function updateAccount(
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  await requireCrmContext()

  if (!id) return fail("Compte introuvable.")

  const parsed = accountSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du compte sont invalides.")
  }

  const existing = await prisma.crmAccount.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Compte introuvable.")

  await prisma.crmAccount.update({
    where: { id },
    data: toData(parsed.data),
  })

  revalidatePath("/dashboard/accounts")
  revalidatePath(`/dashboard/accounts/${id}`)
  return ok("Compte mis à jour.")
}

export async function deleteAccount(id: string): Promise<ActionResult> {
  await requireCrmContext()

  const existing = await prisma.crmAccount.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Compte introuvable.")

  await prisma.crmAccount.delete({ where: { id } })

  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard")
  return ok("Compte supprimé.")
}
