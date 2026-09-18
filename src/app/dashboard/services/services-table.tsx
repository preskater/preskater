"use client"

import * as React from "react"
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
import { serviceSchema } from "@/lib/schemas/crm"
import {
  formatCurrency,
  serviceStatusLabels,
  serviceStatusOptions,
} from "@/lib/crm/labels"
import type { ServiceRow } from "@/lib/crm/queries"
import { createService, deleteService, updateService } from "./actions"

type Option = { label: string; value: string }

export function ServicesTable({
  rows,
  productOptions,
}: {
  rows: ServiceRow[]
  productOptions: Option[]
}) {
  const [editing, setEditing] = React.useState<ServiceRow | null>(null)

  const fields: FormFieldConfig[] = [
    { name: "name", label: "Nom", fullWidth: true },
    {
      name: "status",
      label: "Statut",
      type: "select",
      options: serviceStatusOptions,
    },
    { name: "price", label: "Prix (€)", type: "number", step: "0.01" },
    {
      name: "productId",
      label: "Produit lié",
      type: "select",
      options: productOptions,
      placeholder: "Aucun produit",
    },
    { name: "description", label: "Description", type: "textarea", fullWidth: true },
  ]

  const columns: ResourceColumn<ServiceRow>[] = [
    {
      key: "name",
      header: "Service",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.productName ?? "Service autonome"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <StatusBadge
          value={row.status}
          label={serviceStatusLabels[row.status] ?? row.status}
        />
      ),
    },
    {
      key: "price",
      header: "Prix",
      cell: (row) => formatCurrency(row.price),
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    {
      key: "accounts",
      header: "Clients",
      cell: (row) => row.accountCount,
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
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
            aria-label={`Modifier ${row.name}`}
          >
            <PencilIcon />
          </Button>
          <DeleteButton id={row.id} name={row.name} action={deleteService} />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <PageHeader
        title="Services"
        description="Prestations ponctuelles et récurrentes."
      >
        <ResourceFormDialog
          title="Nouveau service"
          triggerLabel="Nouveau service"
          submitLabel="Créer le service"
          schema={serviceSchema}
          defaultValues={{ status: "ACTIVE", price: 0 }}
          fields={fields}
          action={(values, id) => (id ? updateService(values, id) : createService(values))}
        />
      </PageHeader>

      <ResourceTable
        rows={rows}
        columns={columns}
        searchPlaceholder="Rechercher un service…"
        getSearchText={(row) =>
          [row.name, row.productName].filter(Boolean).join(" ")
        }
      />

      {editing && (
        <ResourceFormDialog
          title={`Modifier ${editing.name}`}
          submitLabel="Enregistrer"
          schema={serviceSchema}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          defaultValues={{
            name: editing.name,
            status: editing.status as never,
            price: editing.price ?? 0,
            productId: editing.productId ?? "",
            description: editing.description ?? "",
          }}
          fields={fields}
          action={(values, id) => updateService(values, id)}
          id={editing.id}
        />
      )}
    </div>
  )
}
