"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PencilIcon, RefreshCcwIcon } from "lucide-react"
import { toast } from "sonner"

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
import { leadSchema } from "@/lib/schemas/crm"
import {
  formatCurrency,
  leadSourceLabels,
  leadSourceOptions,
  leadStatusLabels,
  leadStatusOptions,
} from "@/lib/crm/labels"
import type { LeadRow } from "@/lib/crm/queries"
import { convertLead, createLead, deleteLead, updateLead } from "./actions"

type Option = { label: string; value: string }

export function LeadsTable({
  rows,
  ownerOptions,
}: {
  rows: LeadRow[]
  ownerOptions: Option[]
}) {
  const router = useRouter()
  const [editing, setEditing] = React.useState<LeadRow | null>(null)
  const [converting, setConverting] = React.useState<string | null>(null)

  const fields: FormFieldConfig[] = [
    { name: "firstName", label: "Prénom" },
    { name: "lastName", label: "Nom" },
    { name: "company", label: "Entreprise" },
    { name: "jobTitle", label: "Fonction" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Téléphone" },
    {
      name: "source",
      label: "Source",
      type: "select",
      options: leadSourceOptions,
    },
    {
      name: "status",
      label: "Statut",
      type: "select",
      options: leadStatusOptions,
    },
    {
      name: "estimatedValue",
      label: "Valeur estimée (€)",
      type: "number",
      step: "0.01",
    },
    {
      name: "ownerId",
      label: "Propriétaire",
      type: "select",
      options: ownerOptions,
      placeholder: "Non assigné",
    },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ]

  async function handleConvert(lead: LeadRow) {
    setConverting(lead.id)
    const result = await convertLead(lead.id)
    setConverting(null)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message ?? "Prospect converti.")
    router.refresh()
  }

  const columns: ResourceColumn<LeadRow>[] = [
    {
      key: "name",
      header: "Prospect",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.company ?? "—"}
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
          label={leadStatusLabels[row.status] ?? row.status}
        />
      ),
    },
    {
      key: "source",
      header: "Source",
      cell: (row) => leadSourceLabels[row.source] ?? row.source,
    },
    { key: "email", header: "Email", cell: (row) => row.email ?? "—" },
    {
      key: "value",
      header: "Valeur",
      cell: (row) =>
        row.estimatedValue === null
          ? "—"
          : formatCurrency(row.estimatedValue),
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    { key: "owner", header: "Propriétaire", cell: (row) => row.ownerName ?? "—" },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[1%]",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {row.status !== "CONVERTED" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              disabled={converting === row.id}
              onClick={() => handleConvert(row)}
            >
              <RefreshCcwIcon />
              Convertir
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={() => setEditing(row)}
            aria-label={`Modifier ${row.name}`}
          >
            <PencilIcon />
          </Button>
          <DeleteButton id={row.id} name={row.name} action={deleteLead} />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <PageHeader
        title="Prospects"
        description="Qualifiez puis convertissez vos prospects en clients."
      >
        <ResourceFormDialog
          title="Nouveau prospect"
          triggerLabel="Nouveau prospect"
          submitLabel="Créer le prospect"
          schema={leadSchema}
          defaultValues={{ source: "OTHER", status: "NEW" }}
          fields={fields}
          action={(values, id) => (id ? updateLead(values, id) : createLead(values))}
        />
      </PageHeader>

      <ResourceTable
        rows={rows}
        columns={columns}
        searchPlaceholder="Rechercher un prospect…"
        getSearchText={(row) =>
          [row.name, row.company, row.email, row.ownerName]
            .filter(Boolean)
            .join(" ")
        }
      />

      {editing && (
        <ResourceFormDialog
          title={`Modifier ${editing.name}`}
          submitLabel="Enregistrer"
          schema={leadSchema}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          defaultValues={{
            firstName: editing.firstName,
            lastName: editing.lastName,
            company: editing.company ?? "",
            email: editing.email ?? "",
            phone: editing.phone ?? "",
            source: editing.source as never,
            status: editing.status as never,
            estimatedValue: editing.estimatedValue ?? undefined,
            ownerId: editing.ownerId ?? "",
          }}
          fields={fields}
          action={(values, id) => updateLead(values, id)}
          id={editing.id}
        />
      )}
    </div>
  )
}
