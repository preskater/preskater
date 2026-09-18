import { requireCrmContext } from "@/lib/crm/context"
import {
  getAccountOptions,
  getEmployeeOptions,
  listOpportunities,
} from "@/lib/crm/queries"

import { OpportunitiesTable } from "./opportunities-table"

export default async function OpportunitiesPage() {
  const context = await requireCrmContext()
  const [rows, accountOptions, ownerOptions] = await Promise.all([
    listOpportunities(context.organizationId),
    getAccountOptions(context.organizationId),
    getEmployeeOptions(context.organizationId),
  ])

  return (
    <OpportunitiesTable
      rows={rows}
      accountOptions={accountOptions}
      ownerOptions={ownerOptions}
    />
  )
}
