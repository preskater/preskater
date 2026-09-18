"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { requireAdminContext } from "@/lib/crm/context"
import { organizationSchema } from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"

export async function updateOrganization(
  values: Record<string, unknown>
): Promise<ActionResult> {
  try {
    await requireAdminContext()
  } catch {
    return fail("Vous n'avez pas les droits pour modifier l'organisation.")
  }

  const parsed = organizationSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations de l'organisation sont invalides.")
  }

  try {
    await auth.api.updateOrganization({
      headers: await headers(),
      body: {
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          logo: parsed.data.logo ?? null,
        },
      },
    })
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("already exists")
        ? "Ce slug est déjà utilisé."
        : "La mise à jour de l'organisation a échoué."
    return fail(message)
  }

  revalidatePath("/dashboard/settings/organization")
  revalidatePath("/dashboard")
  return ok("Organisation mise à jour.")
}

export async function inviteMember(values: {
  email: string
  role: "owner" | "admin" | "member"
}): Promise<ActionResult> {
  try {
    await requireAdminContext()
  } catch {
    return fail("Vous n'avez pas les droits pour inviter des membres.")
  }

  if (!values.email || !values.email.includes("@")) {
    return fail("Entrez une adresse email valide.")
  }

  try {
    await auth.api.createInvitation({
      headers: await headers(),
      body: {
        email: values.email,
        role: values.role,
      },
    })
  } catch {
    return fail("L'invitation a échoué. Vérifiez que l'email n'est pas déjà membre.")
  }

  revalidatePath("/dashboard/settings/organization")
  return ok("Invitation envoyée.")
}

export async function cancelInvitation(
  invitationId: string
): Promise<ActionResult> {
  try {
    await requireAdminContext()
  } catch {
    return fail("Vous n'avez pas les droits pour annuler des invitations.")
  }

  try {
    await auth.api.cancelInvitation({
      headers: await headers(),
      body: { invitationId },
    })
  } catch {
    return fail("Impossible d'annuler cette invitation.")
  }

  revalidatePath("/dashboard/settings/organization")
  return ok("Invitation annulée.")
}
