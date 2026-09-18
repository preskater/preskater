import { requireCrmContext } from "@/lib/crm/context"
import {
  getAccountOptions,
  getEmployeeOptions,
  listContacts,
} from "@/lib/crm/queries"

import { ContactsTable } from "./contacts-table"

export default async function ContactsPage() {
  const context = await requireCrmContext()
  const [rows, accountOptions, ownerOptions] = await Promise.all([
    listContacts(context.organizationId),
    getAccountOptions(context.organizationId),
    getEmployeeOptions(context.organizationId),
  ])

  return (
    <ContactsTable
      rows={rows}
      accountOptions={accountOptions}
      ownerOptions={ownerOptions}
    />
  )
}
