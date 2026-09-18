import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { DetailCard, DetailField } from "@/components/crm/detail-card"
import { PageHeader } from "@/components/crm/page-header"
import { StatusBadge } from "@/components/crm/status-badge"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { requireCrmContext } from "@/lib/crm/context"
import {
  activityTypeLabels,
  contactRoleLabels,
  formatCurrency,
  formatDate,
  formatDateTime,
  opportunityStageLabels,
} from "@/lib/crm/labels"
import { getOpportunity, getProductOptions } from "@/lib/crm/queries"

import { OpportunityLineItems } from "./opportunity-detail-client"

export default async function OpportunityDetailPage({
  params,
}: PageProps<"/dashboard/opportunities/[id]">) {
  const { id } = await params
  const context = await requireCrmContext()
  const [opportunity, productOptions] = await Promise.all([
    getOpportunity(context.organizationId, id),
    getProductOptions(context.organizationId),
  ])

  if (!opportunity) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader
        title={opportunity.name}
        description={`${formatCurrency(opportunity.amount)} · ${
          opportunity.probability
        } % de probabilité`}
      >
        <Link
          href="/dashboard/opportunities"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Retour
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <DetailCard title="Informations">
          <dl className="grid grid-cols-2 gap-4">
            <DetailField
              label="Étape"
              value={
                <StatusBadge
                  value={opportunity.stage}
                  label={
                    opportunityStageLabels[opportunity.stage] ??
                    opportunity.stage
                  }
                />
              }
            />
            <DetailField
              label="Propriétaire"
              value={opportunity.ownerName ?? "—"}
            />
            <DetailField
              label="Compte"
              value={
                opportunity.accountId ? (
                  <Link
                    href={`/dashboard/accounts/${opportunity.accountId}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {opportunity.accountName}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
            <DetailField
              label="Clôture"
              value={formatDate(opportunity.closeDate)}
            />
            <DetailField label="Montant" value={formatCurrency(opportunity.amount)} />
            <DetailField
              label="Probabilité"
              value={`${opportunity.probability} %`}
            />
          </dl>
          {opportunity.description && (
            <>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                {opportunity.description}
              </p>
            </>
          )}
        </DetailCard>

        <DetailCard
          title="Contacts associés"
          description={`${opportunity.contacts.length} contact(s)`}
        >
          <div className="flex flex-col gap-3">
            {opportunity.contacts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucun contact associé.
              </p>
            )}
            {opportunity.contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{contact.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {contactRoleLabels[contact.role] ?? contact.role}
                  </span>
                </div>
                {contact.isPrimary && (
                  <Badge variant="outline">Principal</Badge>
                )}
              </div>
            ))}
          </div>
        </DetailCard>

        <DetailCard title="Activités" description="Historique">
          <div className="flex flex-col gap-3">
            {opportunity.activities.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune activité enregistrée.
              </p>
            )}
            {opportunity.activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <StatusBadge
                  value={activity.type}
                  label={activityTypeLabels[activity.type] ?? activity.type}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{activity.subject}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(activity.occurredAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DetailCard>
      </div>

      <div className="px-4 lg:px-6">
        <OpportunityLineItems
          opportunityId={opportunity.id}
          items={opportunity.lineItems}
          productOptions={productOptions}
        />
      </div>
    </div>
  )
}
