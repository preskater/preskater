"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@/generated/prisma/client"

import { requireCrmContext } from "@/lib/crm/context"
import { productSchema, type ProductFormData } from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

function toData(values: ProductFormData) {
  return {
    name: values.name,
    sku: values.sku,
    description: values.description ?? null,
    price: values.price,
    cost: values.cost,
    stock: values.stock,
    status: values.status,
  }
}

export async function createProduct(
  values: Record<string, unknown>
): Promise<ActionResult> {
  await requireCrmContext()
  const parsed = productSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du produit sont invalides.")
  }

  try {
    await prisma.product.create({
      data: toData(parsed.data),
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("Cette référence (SKU) existe déjà.")
    }
    throw error
  }

  revalidatePath("/dashboard/products")
  revalidatePath("/dashboard")
  return ok("Produit créé.")
}

export async function updateProduct(
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  await requireCrmContext()

  if (!id) return fail("Produit introuvable.")

  const parsed = productSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations du produit sont invalides.")
  }

  const existing = await prisma.product.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Produit introuvable.")

  try {
    await prisma.product.update({ where: { id }, data: toData(parsed.data) })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("Cette référence (SKU) existe déjà.")
    }
    throw error
  }

  revalidatePath("/dashboard/products")
  return ok("Produit mis à jour.")
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireCrmContext()

  const existing = await prisma.product.findFirst({
    where: { id },
    select: { id: true },
  })

  if (!existing) return fail("Produit introuvable.")

  try {
    await prisma.product.delete({ where: { id } })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return fail("Ce produit est utilisé dans des commandes ou opportunités.")
    }
    throw error
  }

  revalidatePath("/dashboard/products")
  revalidatePath("/dashboard")
  return ok("Produit supprimé.")
}
