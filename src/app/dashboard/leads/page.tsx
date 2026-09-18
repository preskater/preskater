import { requireCrmContext } from "@/lib/crm/context"
import { getEmployeeOptions, listLeads } from "@/lib/crm/queries"

import { LeadsTable } from "./leads-table"

export default async function LeadsPage() {
  const context = await requireCrmContext()
  const [rows, ownerOptions] = await Promise.all([
    listLeads(context.organizationId),
    getEmployeeOptions(context.organizationId),
  ])

  return <LeadsTable rows={rows} ownerOptions={ownerOptions} />
}
