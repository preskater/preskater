import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { DetailCard, DetailField } from "@/components/crm/detail-card"
import { PageHeader } from "@/components/crm/page-header"
import { StatusBadge } from "@/components/crm/status-badge"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireCrmContext } from "@/lib/crm/context"
import {
  accountTypeLabels,
  activityTypeLabels,
  formatCurrency,
  formatDate,
  formatDateTime,
  opportunityStageLabels,
  orderStatusLabels,
  subscriptionStatusLabels,
} from "@/lib/crm/labels"
import { getAccount } from "@/lib/crm/queries"

export default async function AccountDetailPage({
  params,
}: PageProps<"/dashboard/accounts/[id]">) {
  const { id } = await params
  const context = await requireCrmContext()
  const account = await getAccount(context.organizationId, id)

  if (!account) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader
        title={account.name}
        description={`${accountTypeLabels[account.type] ?? account.type}${
          account.industry ? ` · ${account.industry}` : ""
        }`}
      >
        <Link
          href="/dashboard/accounts"
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
              label="Type"
              value={
                <StatusBadge
                  value={account.type}
                  label={accountTypeLabels[account.type] ?? account.type}
                />
              }
            />
            <DetailField label="Propriétaire" value={account.ownerName ?? "—"} />
            <DetailField label="Email" value={account.email ?? "—"} />
            <DetailField label="Téléphone" value={account.phone ?? "—"} />
            <DetailField label="Site web" value={account.website ?? "—"} />
            <DetailField
              label="Effectif"
              value={account.employeeCount?.toString() ?? "—"}
            />
            <DetailField
              label="CA annuel"
              value={
                account.annualRevenue === null
                  ? "—"
                  : formatCurrency(account.annualRevenue)
              }
            />
            <DetailField
              label="Adresse"
              value={
                [
                  account.address,
                  account.postalCode,
                  account.city,
                  account.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"
              }
            />
          </dl>
          {account.description && (
            <>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                {account.description}
              </p>
            </>
          )}
        </DetailCard>

        <DetailCard
          title="Contacts"
          description={`${account.contacts.length} contact(s)`}
        >
          <div className="flex flex-col gap-3">
            {account.contacts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucun contact rattaché.
              </p>
            )}
            {account.contacts.map((contact) => (
              <div key={contact.id} className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{contact.name}</span>
                <span className="text-xs text-muted-foreground">
                  {contact.jobTitle ?? "—"} · {contact.email ?? "—"}
                </span>
              </div>
            ))}
          </div>
        </DetailCard>

        <DetailCard
          title="Services souscrits"
          description={`${account.services.length} service(s)`}
        >
          <div className="flex flex-col gap-3">
            {account.services.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucun service souscrit.
              </p>
            )}
            {account.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-sm">{service.name}</span>
                <StatusBadge
                  value={service.status}
                  label={
                    subscriptionStatusLabels[service.status] ?? service.status
                  }
                />
              </div>
            ))}
          </div>
        </DetailCard>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <DetailCard
          title="Opportunités"
          description={`${account.opportunities.length} opportunité(s)`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Étape</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Clôture</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {account.opportunities.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Aucune opportunité.
                  </TableCell>
                </TableRow>
              )}
              {account.opportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/opportunities/${opportunity.id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {opportunity.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      value={opportunity.stage}
                      label={
                        opportunityStageLabels[opportunity.stage] ??
                        opportunity.stage
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(opportunity.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(opportunity.closeDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DetailCard>

        <DetailCard
          title="Commandes"
          description={`${account.orders.length} commande(s)`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {account.orders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Aucune commande.
                  </TableCell>
                </TableRow>
              )}
              {account.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      value={order.status}
                      label={orderStatusLabels[order.status] ?? order.status}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.orderDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DetailCard>
      </div>

      <div className="px-4 lg:px-6">
        <DetailCard title="Activités" description="Historique des échanges">
          <div className="flex flex-col gap-3">
            {account.activities.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune activité enregistrée.
              </p>
            )}
            {account.activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <StatusBadge
                    value={activity.type}
                    label={activityTypeLabels[activity.type] ?? activity.type}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {activity.subject}
                    </span>
                    {activity.notes && (
                      <span className="text-xs text-muted-foreground">
                        {activity.notes}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  {formatDateTime(activity.occurredAt)}
                </Badge>
              </div>
            ))}
          </div>
        </DetailCard>
      </div>
    </div>
  )
}
