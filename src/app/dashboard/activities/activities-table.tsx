"use client"

import * as React from "react"

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
import { activitySchema } from "@/lib/schemas/crm"
import {
  activityTypeLabels,
  activityTypeOptions,
  formatDateTime,
} from "@/lib/crm/labels"
import type { ActivityRow } from "@/lib/crm/queries"
import { createActivity, deleteActivity } from "./actions"

type Option = { label: string; value: string }

export function ActivitiesTable({
  rows,
  accountOptions,
  contactOptions,
  opportunityOptions,
  leadOptions,
  orderOptions,
}: {
  rows: ActivityRow[]
  accountOptions: Option[]
  contactOptions: Option[]
  opportunityOptions: Option[]
  leadOptions: Option[]
  orderOptions: Option[]
}) {
  const fields: FormFieldConfig[] = [
    { name: "subject", label: "Sujet", fullWidth: true },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: activityTypeOptions,
    },
    { name: "occurredAt", label: "Date", type: "date" },
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
      name: "leadId",
      label: "Prospect",
      type: "select",
      options: leadOptions,
      placeholder: "Aucun prospect",
    },
    {
      name: "orderId",
      label: "Commande",
      type: "select",
      options: orderOptions,
      placeholder: "Aucune commande",
    },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ]

  const columns: ResourceColumn<ActivityRow>[] = [
    {
      key: "subject",
      header: "Sujet",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.subject}</span>
          {row.notes && (
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {row.notes}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => (
        <StatusBadge
          value={row.type}
          label={activityTypeLabels[row.type] ?? row.type}
        />
      ),
    },
    {
      key: "related",
      header: "Rattaché à",
      cell: (row) =>
        row.accountName ??
        row.opportunityName ??
        row.contactName ??
        row.leadName ??
        "—",
    },
    { key: "user", header: "Par", cell: (row) => row.userName ?? "—" },
    {
      key: "date",
      header: "Date",
      cell: (row) => formatDateTime(row.occurredAt),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[1%]",
      cell: (row) => (
        <div className="flex items-center justify-end">
          <DeleteButton id={row.id} name={row.subject} action={deleteActivity} />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <PageHeader
        title="Activités"
        description="Appels, rendez-vous, emails et notes de votre équipe."
      >
        <ResourceFormDialog
          title="Nouvelle activité"
          triggerLabel="Nouvelle activité"
          submitLabel="Enregistrer"
          schema={activitySchema}
          defaultValues={{ type: "NOTE" }}
          fields={fields}
          action={(values) => createActivity(values)}
        />
      </PageHeader>

      <ResourceTable
        rows={rows}
        columns={columns}
        searchPlaceholder="Rechercher une activité…"
        getSearchText={(row) =>
          [row.subject, row.accountName, row.userName, row.notes]
            .filter(Boolean)
            .join(" ")
        }
      />
    </div>
  )
}
