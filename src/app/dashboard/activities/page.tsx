import { requireCrmContext } from "@/lib/crm/context"
import {
  getAccountOptions,
  getContactOptions,
  getLeadOptions,
  getOpportunityOptions,
  getOrderOptions,
  listActivities,
} from "@/lib/crm/queries"

import { ActivitiesTable } from "./activities-table"

export default async function ActivitiesPage() {
  const context = await requireCrmContext()
  const [
    rows,
    accountOptions,
    contactOptions,
    opportunityOptions,
    leadOptions,
    orderOptions,
  ] = await Promise.all([
    listActivities(context.organizationId),
    getAccountOptions(context.organizationId),
    getContactOptions(context.organizationId),
    getOpportunityOptions(context.organizationId),
    getLeadOptions(context.organizationId),
    getOrderOptions(context.organizationId),
  ])

  return (
    <ActivitiesTable
      rows={rows}
      accountOptions={accountOptions}
      contactOptions={contactOptions}
      opportunityOptions={opportunityOptions}
      leadOptions={leadOptions}
      orderOptions={orderOptions}
    />
  )
}
