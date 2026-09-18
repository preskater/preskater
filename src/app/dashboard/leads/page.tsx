import { requireCrmContext } from "@/lib/crm/context"
import { getEmployeeOptions, listLeads } from "@/lib/crm/queries"

import { LeadsTable } from "./leads-table"

export default async function LeadsPage() {
  await requireCrmContext()
  const [rows, ownerOptions] = await Promise.all([
    listLeads(),
    getEmployeeOptions(),
  ])

  return <LeadsTable rows={rows} ownerOptions={ownerOptions} />
}
