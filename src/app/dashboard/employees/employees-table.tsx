"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"

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
import { employeeSchema } from "@/lib/schemas/crm"
import {
  departmentLabels,
  departmentOptions,
  formatDate,
  userRoleLabels,
  userRoleOptions,
} from "@/lib/crm/labels"
import type { EmployeeRow } from "@/lib/crm/queries"
import { updateEmployee } from "./actions"

type Option = { label: string; value: string }

export function EmployeesTable({
  rows,
  canManage,
}: {
  rows: EmployeeRow[]
  canManage: boolean
}) {
  const [editing, setEditing] = React.useState<EmployeeRow | null>(null)

  const managerOptions: Option[] = rows.map((row) => ({
    label: row.name,
    value: row.id,
  }))

  const fields: FormFieldConfig[] = [
    { name: "name", label: "Nom complet" },
    {
      name: "role",
      label: "Rôle CRM",
      type: "select",
      options: userRoleOptions,
    },
    {
      name: "department",
      label: "Département",
      type: "select",
      options: departmentOptions,
    },
    { name: "jobTitle", label: "Intitulé du poste" },
    { name: "phone", label: "Téléphone" },
    {
      name: "managerId",
      label: "Manager",
      type: "select",
      options: managerOptions,
      placeholder: "Aucun manager",
    },
  ]

  const columns: ResourceColumn<EmployeeRow>[] = [
    {
      key: "name",
      header: "Employé",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rôle",
      cell: (row) => userRoleLabels[row.role] ?? row.role,
    },
    {
      key: "department",
      header: "Département",
      cell: (row) =>
        row.department ? departmentLabels[row.department] ?? row.department : "—",
    },
    { key: "jobTitle", header: "Poste", cell: (row) => row.jobTitle ?? "—" },
    { key: "phone", header: "Téléphone", cell: (row) => row.phone ?? "—" },
    {
      key: "createdAt",
      header: "Arrivée",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[1%]",
      cell: (row) =>
        canManage ? (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              onClick={() => setEditing(row)}
              aria-label={`Modifier ${row.name}`}
            >
              <PencilIcon />
            </Button>
          </div>
        ) : null,
    },
  ]

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <PageHeader
        title="Employés"
        description="Les membres de votre organisation et leurs rôles."
      />

      <ResourceTable
        rows={rows}
        columns={columns}
        searchPlaceholder="Rechercher un employé…"
        getSearchText={(row) =>
          [row.name, row.email, row.jobTitle, row.department]
            .filter(Boolean)
            .join(" ")
        }
      />

      {editing && (
        <ResourceFormDialog
          title={`Modifier ${editing.name}`}
          submitLabel="Enregistrer"
          schema={employeeSchema}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          defaultValues={{
            name: editing.name,
            role: editing.role as never,
            department: (editing.department ?? "SALES") as never,
            jobTitle: editing.jobTitle ?? "",
            phone: editing.phone ?? "",
            managerId: editing.managerId ?? "",
          }}
          fields={fields}
          action={(values, id) => updateEmployee(values, id)}
          id={editing.id}
        />
      )}
    </div>
  )
}
