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
import { productSchema } from "@/lib/schemas/crm"
import {
  formatCurrency,
  productStatusLabels,
  productStatusOptions,
} from "@/lib/crm/labels"
import type { ProductRow } from "@/lib/crm/queries"
import { createProduct, deleteProduct, updateProduct } from "./actions"

export function ProductsTable({ rows }: { rows: ProductRow[] }) {
  const [editing, setEditing] = React.useState<ProductRow | null>(null)

  const fields: FormFieldConfig[] = [
    { name: "name", label: "Nom", fullWidth: true },
    { name: "sku", label: "Référence (SKU)" },
    {
      name: "status",
      label: "Statut",
      type: "select",
      options: productStatusOptions,
    },
    { name: "price", label: "Prix de vente (€)", type: "number", step: "0.01" },
    { name: "cost", label: "Coût (€)", type: "number", step: "0.01" },
    { name: "stock", label: "Stock", type: "number" },
    { name: "description", label: "Description", type: "textarea", fullWidth: true },
  ]

  const columns: ResourceColumn<ProductRow>[] = [
    {
      key: "name",
      header: "Produit",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.sku}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <StatusBadge
          value={row.status}
          label={productStatusLabels[row.status] ?? row.status}
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
      key: "cost",
      header: "Coût",
      cell: (row) => formatCurrency(row.cost),
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    {
      key: "margin",
      header: "Marge",
      cell: (row) => {
        const price = row.price ?? 0
        const cost = row.cost ?? 0
        const margin = price > 0 ? ((price - cost) / price) * 100 : 0
        return `${margin.toFixed(1)} %`
      },
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    {
      key: "stock",
      header: "Stock",
      cell: (row) => row.stock,
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
          <DeleteButton id={row.id} name={row.name} action={deleteProduct} />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <PageHeader
        title="Produits"
        description="Votre catalogue de biens et de licences."
      >
        <ResourceFormDialog
          title="Nouveau produit"
          triggerLabel="Nouveau produit"
          submitLabel="Créer le produit"
          schema={productSchema}
          defaultValues={{ status: "ACTIVE", price: 0, cost: 0, stock: 0 }}
          fields={fields}
          action={(values, id) => (id ? updateProduct(values, id) : createProduct(values))}
        />
      </PageHeader>

      <ResourceTable
        rows={rows}
        columns={columns}
        searchPlaceholder="Rechercher un produit…"
        getSearchText={(row) => [row.name, row.sku].filter(Boolean).join(" ")}
      />

      {editing && (
        <ResourceFormDialog
          title={`Modifier ${editing.name}`}
          submitLabel="Enregistrer"
          schema={productSchema}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          defaultValues={{
            name: editing.name,
            sku: editing.sku,
            status: editing.status as never,
            price: editing.price ?? 0,
            cost: editing.cost ?? 0,
            stock: editing.stock,
            description: editing.description ?? "",
          }}
          fields={fields}
          action={(values, id) => updateProduct(values, id)}
          id={editing.id}
        />
      )}
    </div>
  )
}
