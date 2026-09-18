"use client"

import * as React from "react"
import Link from "next/link"
import { PencilIcon } from "lucide-react"

import { DeleteButton } from "@/components/crm/delete-button"
import { PageHeader } from "@/components/crm/page-header"
import {
  ResourceFormDialog,
  type FormFieldConfig,
} from "@/components/crm/resource-form-dialog"
import {
  ResourceTable,
  type ResourceColumn,
} from "@/components/crm/resource-table"
import { StatusBadge } from "@/components/crm/status-badge"
import { Button } from "@/components/ui/button"
import { orderSchema } from "@/lib/schemas/crm"
import {
  formatCurrency,
  formatDate,
  orderStatusLabels,
  orderStatusOptions,
} from "@/lib/crm/labels"
import type { OrderRow } from "@/lib/crm/queries"
import { createOrder, deleteOrder, updateOrder } from "./actions"

type Option = { label: string; value: string }

function toDateInput(value: string) {
  return value.slice(0, 10)
}

export function OrdersTable({
  rows,
  accountOptions,
  contactOptions,
  opportunityOptions,
  ownerOptions,
}: {
  rows: OrderRow[]
  accountOptions: Option[]
  contactOptions: Option[]
  opportunityOptions: Option[]
  ownerOptions: Option[]
}) {
  const [editing, setEditing] = React.useState<OrderRow | null>(null)

  const fields: FormFieldConfig[] = [
    { name: "orderNumber", label: "Numéro de commande" },
    {
      name: "status",
      label: "Statut",
      type: "select",
      options: orderStatusOptions,
    },
    {
      name: "accountId",
      label: "Compte",
      type: "select",
      options: accountOptions,
      placeholder: "Aucun compte",
    },
    {
      name: "contactId",
      label: "Contact",
      type: "select",
      options: contactOptions,
      placeholder: "Aucun contact",
    },
    {
      name: "opportunityId",
      label: "Opportunité",
      type: "select",
      options: opportunityOptions,
      placeholder: "Aucune opportunité",
    },
    {
      name: "ownerId",
      label: "Propriétaire",
      type: "select",
      options: ownerOptions,
      placeholder: "Non assigné",
    },
    { name: "orderDate", label: "Date", type: "date" },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ]

  const columns: ResourceColumn<OrderRow>[] = [
    {
      key: "orderNumber",
      header: "Commande",
      cell: (row) => (
        <Link
          href={`/dashboard/orders/${row.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {row.orderNumber}
        </Link>
      ),
    },
    { key: "account", header: "Compte", cell: (row) => row.accountName ?? "—" },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <StatusBadge
          value={row.status}
          label={orderStatusLabels[row.status] ?? row.status}
        />
      ),
    },
    {
      key: "items",
      header: "Lignes",
      cell: (row) => row.itemCount,
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    {
      key: "total",
      header: "Total",
      cell: (row) => formatCurrency(row.total),
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => formatDate(row.orderDate),
    },
    { key: "owner", header: "Propriétaire", cell: (row) => row.ownerName ?? "—" },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[1%]",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={() => setEditing(row)}
            aria-label={`Modifier ${row.orderNumber}`}
          >
            <PencilIcon />
          </Button>
          <DeleteButton
            id={row.id}
            name={row.orderNumber}
            action={deleteOrder}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <PageHeader
        title="Commandes"
        description="Les ventes confirmées et leur facturation."
      >
        <ResourceFormDialog
          title="Nouvelle commande"
          triggerLabel="Nouvelle commande"
          submitLabel="Créer la commande"
          schema={orderSchema}
          defaultValues={{ status: "DRAFT" }}
          fields={fields}
          action={(values, id) => (id ? updateOrder(values, id) : createOrder(values))}
        />
      </PageHeader>

      <ResourceTable
        rows={rows}
        columns={columns}
        searchPlaceholder="Rechercher une commande…"
        getSearchText={(row) =>
          [row.orderNumber, row.accountName, row.ownerName]
            .filter(Boolean)
            .join(" ")
        }
      />

      {editing && (
        <ResourceFormDialog
          title={`Modifier ${editing.orderNumber}`}
          submitLabel="Enregistrer"
          schema={orderSchema}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          defaultValues={{
            orderNumber: editing.orderNumber,
            status: editing.status as never,
            accountId: editing.accountId ?? "",
            contactId: editing.contactId ?? "",
            opportunityId: editing.opportunityId ?? "",
            ownerId: editing.ownerId ?? "",
            orderDate: toDateInput(editing.orderDate),
          }}
          fields={fields}
          action={(values, id) => updateOrder(values, id)}
          id={editing.id}
        />
      )}
    </div>
  )
}
