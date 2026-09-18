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
import { accountSchema } from "@/lib/schemas/crm"
import {
  accountTypeLabels,
  accountTypeOptions,
  formatCurrency,
} from "@/lib/crm/labels"
import type { AccountRow } from "@/lib/crm/queries"
import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "./actions"

type Option = { label: string; value: string }

export function AccountsTable({
  rows,
  ownerOptions,
}: {
  rows: AccountRow[]
  ownerOptions: Option[]
}) {
  const fields: FormFieldConfig[] = [
    { name: "name", label: "Nom du compte", fullWidth: true },
    { name: "type", label: "Type", type: "select", options: accountTypeOptions },
    { name: "industry", label: "Secteur" },
    { name: "website", label: "Site web" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Téléphone" },
    {
      name: "ownerId",
      label: "Propriétaire",
      type: "select",
      options: ownerOptions,
      placeholder: "Non assigné",
    },
    { name: "employeeCount", label: "Effectif", type: "number" },
    {
      name: "annualRevenue",
      label: "Chiffre d'affaires (€)",
      type: "number",
      step: "0.01",
    },
    { name: "address", label: "Adresse", fullWidth: true },
    { name: "postalCode", label: "Code postal" },
    { name: "city", label: "Ville" },
    { name: "state", label: "Région" },
    { name: "country", label: "Pays" },
    { name: "description", label: "Description", type: "textarea", fullWidth: true },
  ]

  const [editing, setEditing] = React.useState<AccountRow | null>(null)

  const columns: ResourceColumn<AccountRow>[] = [
    {
      key: "name",
      header: "Compte",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.industry ?? "—"}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => (
        <StatusBadge value={row.type} label={accountTypeLabels[row.type] ?? row.type} />
      ),
    },
    {
      key: "location",
      header: "Localisation",
      cell: (row) => (
        <span className="text-muted-foreground">
          {[row.city, row.country].filter(Boolean).join(", ") || "—"}
        </span>
      ),
    },
    {
      key: "revenue",
      header: "CA annuel",
      cell: (row) =>
        row.annualRevenue === null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          formatCurrency(row.annualRevenue)
        ),
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    {
      key: "relations",
      header: "Relations",
      cell: (row) => (
        <span className="text-muted-foreground">
          {row.contactCount} contacts · {row.opportunityCount} opp.
        </span>
      ),
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
            aria-label={`Modifier ${row.name}`}
          >
            <PencilIcon />
          </Button>
          <DeleteButton id={row.id} name={row.name} action={deleteAccount} />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <PageHeader
        title="Comptes"
        description="Entreprises et organisations de votre portefeuille."
      >
        <ResourceFormDialog
          title="Nouveau compte"
          description="Ajoutez une entreprise à votre portefeuille."
          triggerLabel="Nouveau compte"
          submitLabel="Créer le compte"
          schema={accountSchema}
          defaultValues={{ type: "PROSPECT" }}
          fields={fields}
          action={(values, id) => id ? updateAccount(values, id) : createAccount(values)}
        />
      </PageHeader>

      <ResourceTable
        rows={rows}
        columns={columns}
        rowHref={(row) => `/dashboard/accounts/${row.id}`}
        searchPlaceholder="Rechercher un compte…"
        getSearchText={(row) =>
          [row.name, row.industry, row.city, row.country, row.ownerName]
            .filter(Boolean)
            .join(" ")
        }
      />

      {editing && (
        <ResourceFormDialog
          title={`Modifier ${editing.name}`}
          submitLabel="Enregistrer"
          schema={accountSchema}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          defaultValues={{
            name: editing.name,
            type: editing.type as never,
            industry: editing.industry ?? "",
            website: editing.website ?? "",
            email: editing.email ?? "",
            phone: editing.phone ?? "",
            city: editing.city ?? "",
            country: editing.country ?? "",
            annualRevenue: editing.annualRevenue ?? undefined,
            employeeCount: editing.employeeCount ?? undefined,
            ownerId: editing.ownerId ?? "",
          }}
          fields={fields}
          action={(values, id) => updateAccount(values, id)}
          id={editing.id}
        />
      )}
    </div>
  )
}
