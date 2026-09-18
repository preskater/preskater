import { canManage, requireCrmContext } from "@/lib/crm/context"
import { listEmployees } from "@/lib/crm/queries"

import { EmployeesTable } from "./employees-table"

export default async function EmployeesPage() {
  const context = await requireCrmContext()
  const rows = await listEmployees(context.organizationId)

  return <EmployeesTable rows={rows} canManage={canManage(context)} />
}
