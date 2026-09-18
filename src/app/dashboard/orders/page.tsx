import { requireCrmContext } from "@/lib/crm/context"
import {
  getAccountOptions,
  getContactOptions,
  getEmployeeOptions,
  getOpportunityOptions,
  listOrders,
} from "@/lib/crm/queries"

import { OrdersTable } from "./orders-table"

export default async function OrdersPage() {
  const context = await requireCrmContext()
  const [
    rows,
    accountOptions,
    contactOptions,
    opportunityOptions,
    ownerOptions,
  ] = await Promise.all([
    listOrders(context.organizationId),
    getAccountOptions(context.organizationId),
    getContactOptions(context.organizationId),
    getOpportunityOptions(context.organizationId),
    getEmployeeOptions(context.organizationId),
  ])

  return (
    <OrdersTable
      rows={rows}
      accountOptions={accountOptions}
      contactOptions={contactOptions}
      opportunityOptions={opportunityOptions}
      ownerOptions={ownerOptions}
    />
  )
}
