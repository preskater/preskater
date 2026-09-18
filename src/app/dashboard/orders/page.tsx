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
  await requireCrmContext()
  const [
    rows,
    accountOptions,
    contactOptions,
    opportunityOptions,
    ownerOptions,
  ] = await Promise.all([
    listOrders(),
    getAccountOptions(),
    getContactOptions(),
    getOpportunityOptions(),
    getEmployeeOptions(),
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
