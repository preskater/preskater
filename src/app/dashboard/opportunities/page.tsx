import { requireCrmContext } from "@/lib/crm/context"
import {
  getAccountOptions,
  getEmployeeOptions,
  listOpportunities,
} from "@/lib/crm/queries"

import { OpportunitiesTable } from "./opportunities-table"

export default async function OpportunitiesPage() {
  await requireCrmContext()
  const [rows, accountOptions, ownerOptions] = await Promise.all([
    listOpportunities(),
    getAccountOptions(),
    getEmployeeOptions(),
  ])

  return (
    <OpportunitiesTable
      rows={rows}
      accountOptions={accountOptions}
      ownerOptions={ownerOptions}
    />
  )
}
