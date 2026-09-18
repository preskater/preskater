import { requireCrmContext } from "@/lib/crm/context"
import {
  getEmployeeOptions,
  listAccounts,
} from "@/lib/crm/queries"

import { AccountsTable } from "./accounts-table"

export default async function AccountsPage() {
  await requireCrmContext()
  const [rows, ownerOptions] = await Promise.all([
    listAccounts(),
    getEmployeeOptions(),
  ])

  return <AccountsTable rows={rows} ownerOptions={ownerOptions} />
}
