"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@/generated/prisma/client"

import { requireCrmContext } from "@/lib/crm/context"
import {
  orderItemSchema,
  orderSchema,
  type OrderFormData,
} from "@/lib/schemas/crm"
import { fail, ok, type ActionResult } from "@/lib/crm/types"
import { prisma } from "@/lib/prisma"

function toData(values: OrderFormData) {
  return {
    orderNumber: values.orderNumber,
    accountId: values.accountId ?? null,
    contactId: values.contactId ?? null,
    opportunityId: values.opportunityId ?? null,
    ownerId: values.ownerId ?? null,
    status: values.status,
    orderDate: values.orderDate ?? new Date(),
    notes: values.notes ?? null,
  }
}

export async function createOrder(
  values: Record<string, unknown>
): Promise<ActionResult> {
  const context = await requireCrmContext()
  const parsed = orderSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations de la commande sont invalides.")
  }

  try {
    await prisma.order.create({
      data: { ...toData(parsed.data), organizationId: context.organizationId },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("Ce numéro de commande existe déjà.")
    }
    throw error
  }

  revalidatePath("/dashboard/orders")
  revalidatePath("/dashboard")
  return ok("Commande créée.")
}

export async function updateOrder(
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  const context = await requireCrmContext()

  if (!id) return fail("Commande introuvable.")

  const parsed = orderSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Les informations de la commande sont invalides.")
  }

  const existing = await prisma.order.findFirst({
    where: { id, organizationId: context.organizationId },
    select: { id: true },
  })

  if (!existing) return fail("Commande introuvable.")

  try {
    await prisma.order.update({ where: { id }, data: toData(parsed.data) })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("Ce numéro de commande existe déjà.")
    }
    throw error
  }

  revalidatePath("/dashboard/orders")
  revalidatePath(`/dashboard/orders/${id}`)
  return ok("Commande mise à jour.")
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  const context = await requireCrmContext()

  const existing = await prisma.order.findFirst({
    where: { id, organizationId: context.organizationId },
    select: { id: true },
  })

  if (!existing) return fail("Commande introuvable.")

  await prisma.order.delete({ where: { id } })

  revalidatePath("/dashboard/orders")
  revalidatePath("/dashboard")
  return ok("Commande supprimée.")
}

async function recalculateTotal(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } })
  const total = items.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0
  )
  await prisma.order.update({
    where: { id: orderId },
    data: { total: total.toFixed(2) },
  })
}

export async function addOrderItem(
  values: Record<string, unknown>,
  orderId: string
): Promise<ActionResult> {
  const context = await requireCrmContext()
  const parsed = orderItemSchema.safeParse(values)

  if (!parsed.success) {
    return fail("Ligne de commande invalide.")
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, organizationId: context.organizationId },
    select: { id: true },
  })

  if (!order) return fail("Commande introuvable.")

  await prisma.orderItem.create({
    data: {
      orderId,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
      unitPrice: parsed.data.unitPrice,
      subtotal: (parsed.data.unitPrice * parsed.data.quantity).toFixed(2),
    },
  })

  await recalculateTotal(orderId)

  revalidatePath(`/dashboard/orders/${orderId}`)
  revalidatePath("/dashboard/orders")
  return ok("Ligne ajoutée.")
}

export async function deleteOrderItem(id: string): Promise<ActionResult> {
  const context = await requireCrmContext()

  const item = await prisma.orderItem.findFirst({
    where: { id, order: { organizationId: context.organizationId } },
    select: { id: true, orderId: true },
  })

  if (!item) return fail("Ligne introuvable.")

  await prisma.orderItem.delete({ where: { id } })
  await recalculateTotal(item.orderId)

  revalidatePath(`/dashboard/orders/${item.orderId}`)
  revalidatePath("/dashboard/orders")
  return ok("Ligne supprimée.")
}
