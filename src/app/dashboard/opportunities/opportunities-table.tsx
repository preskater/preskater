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
import { opportunitySchema } from "@/lib/schemas/crm"
import {
  formatCurrency,
  formatDate,
  opportunityStageLabels,
  opportunityStageOptions,
} from "@/lib/crm/labels"
import type { OpportunityRow } from "@/lib/crm/queries"
import {
  createOpportunity,
  deleteOpportunity,
  updateOpportunity,
} from "./actions"

type Option = { label: string; value: string }

function toDateInput(value: string | null) {
  if (!value) return ""
  return value.slice(0, 10)
}

export function OpportunitiesTable({
  rows,
  accountOptions,
  ownerOptions,
}: {
  rows: OpportunityRow[]
  accountOptions: Option[]
  ownerOptions: Option[]
}) {
  const [editing, setEditing] = React.useState<OpportunityRow | null>(null)

  const fields: FormFieldConfig[] = [
    { name: "name", label: "Nom", fullWidth: true },
    {
      name: "accountId",
      label: "Compte",
      type: "select",
      options: accountOptions,
      placeholder: "Aucun compte",
    },
    {
      name: "ownerId",
      label: "Propriétaire",
      type: "select",
      options: ownerOptions,
      placeholder: "Non assigné",
    },
    {
      name: "stage",
      label: "Étape",
      type: "select",
      options: opportunityStageOptions,
    },
    { name: "amount", label: "Montant (€)", type: "number", step: "0.01" },
    { name: "probability", label: "Probabilité (%)", type: "number" },
    { name: "closeDate", label: "Date de clôture", type: "date" },
    { name: "description", label: "Description", type: "textarea", fullWidth: true },
  ]

  const columns: ResourceColumn<OpportunityRow>[] = [
    {
      key: "name",
      header: "Opportunité",
      cell: (row) => (
        <Link
          href={`/dashboard/opportunities/${row.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    { key: "account", header: "Compte", cell: (row) => row.accountName ?? "—" },
    {
      key: "stage",
      header: "Étape",
      cell: (row) => (
        <StatusBadge
          value={row.stage}
          label={opportunityStageLabels[row.stage] ?? row.stage}
        />
      ),
    },
    {
      key: "amount",
      header: "Montant",
      cell: (row) => formatCurrency(row.amount),
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    {
      key: "probability",
      header: "Probabilité",
      cell: (row) => `${row.probability} %`,
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    {
      key: "closeDate",
      header: "Clôture",
      cell: (row) => formatDate(row.closeDate),
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
          <DeleteButton id={row.id} name={row.name} action={deleteOpportunity} />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <PageHeader
        title="Opportunités"
        description="Suivez vos affaires et leur avancement dans le pipeline."
      >
        <ResourceFormDialog
          title="Nouvelle opportunité"
          triggerLabel="Nouvelle opportunité"
          submitLabel="Créer l'opportunité"
          schema={opportunitySchema}
          defaultValues={{ stage: "PROSPECTING", amount: 0, probability: 0 }}
          fields={fields}
          action={(values, id) =>
            id ? updateOpportunity(values, id) : createOpportunity(values)
          }
        />
      </PageHeader>

      <ResourceTable
        rows={rows}
        columns={columns}
        searchPlaceholder="Rechercher une opportunité…"
        getSearchText={(row) =>
          [row.name, row.accountName, row.ownerName].filter(Boolean).join(" ")
        }
      />

      {editing && (
        <ResourceFormDialog
          title={`Modifier ${editing.name}`}
          submitLabel="Enregistrer"
          schema={opportunitySchema}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          defaultValues={{
            name: editing.name,
            accountId: editing.accountId ?? "",
            ownerId: editing.ownerId ?? "",
            stage: editing.stage as never,
            amount: editing.amount ?? 0,
            probability: editing.probability,
            closeDate: toDateInput(editing.closeDate),
            description: editing.description ?? "",
          }}
          fields={fields}
          action={(values, id) => updateOpportunity(values, id)}
          id={editing.id}
        />
      )}
    </div>
  )
}
