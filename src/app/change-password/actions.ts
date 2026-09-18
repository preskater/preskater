"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { requireCrmContext } from "@/lib/crm/context"
import { changePasswordSchema } from "@/lib/schemas/auth"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

export async function changeInitialPassword(
  values: Record<string, unknown>
): Promise<ActionResult> {
  const context = await requireCrmContext()

  const parsed = changePasswordSchema.safeParse(values)

  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ??
        "Les informations du mot de passe sont invalides."
    )
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Invalid password")
        ? "Le mot de passe actuel est incorrect."
        : "Le changement de mot de passe a échoué."
    return fail(message)
  }

  await prisma.user.update({
    where: { id: context.user.id },
    data: { mustChangePassword: false },
  })

  revalidatePath("/", "layout")
  return ok("Mot de passe mis à jour.")
}
