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
  await requireCrmContext()
  const [
    rows,
    accountOptions,
    contactOptions,
    opportunityOptions,
    leadOptions,
    orderOptions,
  ] = await Promise.all([
    listActivities(),
    getAccountOptions(),
    getContactOptions(),
    getOpportunityOptions(),
    getLeadOptions(),
    getOrderOptions(),
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
