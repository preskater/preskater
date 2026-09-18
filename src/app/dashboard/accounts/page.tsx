import { requireCrmContext } from "@/lib/crm/context"
import {
  getEmployeeOptions,
  listAccounts,
} from "@/lib/crm/queries"

import { AccountsTable } from "./accounts-table"

export default async function AccountsPage() {
  const context = await requireCrmContext()
  const [rows, ownerOptions] = await Promise.all([
    listAccounts(context.organizationId),
    getEmployeeOptions(context.organizationId),
  ])

  return <AccountsTable rows={rows} ownerOptions={ownerOptions} />
}
