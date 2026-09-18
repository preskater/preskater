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
import { Button } from "@/components/ui/button"
import { contactSchema } from "@/lib/schemas/crm"
import type { ContactRow } from "@/lib/crm/queries"
import { createContact, deleteContact, updateContact } from "./actions"

type Option = { label: string; value: string }

export function ContactsTable({
  rows,
  accountOptions,
  ownerOptions,
}: {
  rows: ContactRow[]
  accountOptions: Option[]
  ownerOptions: Option[]
}) {
  const fields: FormFieldConfig[] = [
    { name: "firstName", label: "Prénom" },
    { name: "lastName", label: "Nom" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Téléphone" },
    { name: "mobile", label: "Mobile" },
    { name: "jobTitle", label: "Fonction" },
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
    { name: "address", label: "Adresse", fullWidth: true },
    { name: "postalCode", label: "Code postal" },
    { name: "city", label: "Ville" },
    { name: "country", label: "Pays" },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ]

  const [editing, setEditing] = React.useState<ContactRow | null>(null)

  const columns: ResourceColumn<ContactRow>[] = [
    {
      key: "name",
      header: "Nom",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.jobTitle ?? "—"}
          </span>
        </div>
      ),
    },
    { key: "account", header: "Compte", cell: (row) => row.accountName ?? "—" },
    { key: "email", header: "Email", cell: (row) => row.email ?? "—" },
    { key: "phone", header: "Téléphone", cell: (row) => row.phone ?? "—" },
    {
      key: "location",
      header: "Ville",
      cell: (row) => row.city ?? "—",
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
          <DeleteButton id={row.id} name={row.name} action={deleteContact} />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <PageHeader
        title="Contacts"
        description="Les personnes avec qui vous échangez."
      >
        <ResourceFormDialog
          title="Nouveau contact"
          triggerLabel="Nouveau contact"
          submitLabel="Créer le contact"
          schema={contactSchema}
          defaultValues={{}}
          fields={fields}
          action={(values, id) =>
            id ? updateContact(values, id) : createContact(values)
          }
        />
      </PageHeader>

      <ResourceTable
        rows={rows}
        columns={columns}
        searchPlaceholder="Rechercher un contact…"
        getSearchText={(row) =>
          [row.name, row.email, row.accountName, row.city, row.ownerName]
            .filter(Boolean)
            .join(" ")
        }
      />

      {editing && (
        <ResourceFormDialog
          title={`Modifier ${editing.name}`}
          submitLabel="Enregistrer"
          schema={contactSchema}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          defaultValues={{
            firstName: editing.firstName,
            lastName: editing.lastName,
            email: editing.email ?? "",
            phone: editing.phone ?? "",
            mobile: editing.mobile ?? "",
            jobTitle: editing.jobTitle ?? "",
            city: editing.city ?? "",
            country: editing.country ?? "",
            accountId: editing.accountId ?? "",
            ownerId: editing.ownerId ?? "",
          }}
          fields={fields}
          action={(values, id) => updateContact(values, id)}
          id={editing.id}
        />
      )}
    </div>
  )
}
