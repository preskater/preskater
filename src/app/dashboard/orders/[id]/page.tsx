import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { DetailCard, DetailField } from "@/components/crm/detail-card"
import { PageHeader } from "@/components/crm/page-header"
import { StatusBadge } from "@/components/crm/status-badge"
import { Separator } from "@/components/ui/separator"
import { requireCrmContext } from "@/lib/crm/context"
import {
  formatCurrency,
  formatDate,
  orderStatusLabels,
} from "@/lib/crm/labels"
import { getOrder, getProductOptions } from "@/lib/crm/queries"

import { OrderItems } from "./order-detail-client"

export default async function OrderDetailPage({
  params,
}: PageProps<"/dashboard/orders/[id]">) {
  const { id } = await params
  const context = await requireCrmContext()
  const [order, productOptions] = await Promise.all([
    getOrder(context.organizationId, id),
    getProductOptions(context.organizationId),
  ])

  if (!order) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader
        title={order.orderNumber}
        description={`${formatCurrency(order.total)} · ${formatDate(
          order.orderDate
        )}`}
      >
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Retour
        </Link>
      </PageHeader>

      <div className="px-4 lg:px-6">
        <DetailCard title="Informations">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <DetailField
              label="Statut"
              value={
                <StatusBadge
                  value={order.status}
                  label={orderStatusLabels[order.status] ?? order.status}
                />
              }
            />
            <DetailField label="Compte" value={order.accountName ?? "—"} />
            <DetailField label="Contact" value={order.contactName ?? "—"} />
            <DetailField label="Propriétaire" value={order.ownerName ?? "—"} />
          </dl>
          {order.notes && (
            <>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </>
          )}
        </DetailCard>
      </div>

      <div className="px-4 lg:px-6">
        <OrderItems
          orderId={order.id}
          items={order.items}
          productOptions={productOptions}
        />
      </div>
    </div>
  )
}
