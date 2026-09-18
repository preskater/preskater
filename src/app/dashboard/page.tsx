import Link from "next/link"
import {
  BuildingIcon,
  ShoppingCartIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react"

import { DetailCard } from "@/components/crm/detail-card"
import { PageHeader } from "@/components/crm/page-header"
import { StatusBadge } from "@/components/crm/status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { requireCrmContext } from "@/lib/crm/context"
import {
  activityTypeLabels,
  formatCurrency,
  formatDateTime,
  opportunityStageLabels,
} from "@/lib/crm/labels"
import { getDashboardData } from "@/lib/crm/queries"

export default async function DashboardPage() {
  const context = await requireCrmContext()
  const data = await getDashboardData(context)

  const cards = [
    {
      title: "Comptes",
      value: String(data.accountCount),
      hint: `${data.contactCount} contacts`,
      icon: <BuildingIcon className="size-4 text-muted-foreground" />,
      href: "/dashboard/accounts",
    },
    {
      title: "Pipeline ouvert",
      value: formatCurrency(data.openPipeline.amount),
      hint: `${data.openPipeline.count} opportunités`,
      icon: <TrendingUpIcon className="size-4 text-muted-foreground" />,
      href: "/dashboard/opportunities",
    },
    {
      title: "Gagné ce mois-ci",
      value: formatCurrency(data.wonThisMonth.amount),
      hint: `${data.wonThisMonth.count} affaires`,
      icon: <TargetIcon className="size-4 text-muted-foreground" />,
      href: "/dashboard/opportunities",
    },
    {
      title: "Commandes en cours",
      value: formatCurrency(data.pendingOrders.amount),
      hint: `${data.pendingOrders.count} commandes · ${data.leadsToQualify} prospects à qualifier`,
      icon: <ShoppingCartIcon className="size-4 text-muted-foreground" />,
      href: "/dashboard/orders",
    },
  ]

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader
        title={`Bonjour, ${context.user.name.split(" ")[0]}`}
        description={`Vue d'ensemble de ${data.organizationName}`}
      />

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  {card.icon}
                  {card.title}
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {card.value}
                </CardTitle>
                <CardDescription>{card.hint}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <DetailCard
          title="Pipeline par étape"
          description="Montant cumulé des opportunités"
        >
          <div className="flex flex-col gap-3">
            {data.pipeline.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune opportunité pour le moment.
              </p>
            )}
            {data.pipeline.map((entry) => (
              <div
                key={entry.stage}
                className="flex items-center justify-between gap-3"
              >
                <StatusBadge
                  value={entry.stage}
                  label={opportunityStageLabels[entry.stage] ?? entry.stage}
                />
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {entry.count} opp.
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(entry.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DetailCard>

        <DetailCard
          title="Dernières opportunités"
          action={
            <Link
              href="/dashboard/opportunities"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Tout voir
            </Link>
          }
        >
          <div className="flex flex-col gap-3">
            {data.recentOpportunities.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune opportunité récente.
              </p>
            )}
            {data.recentOpportunities.map((opportunity) => (
              <Link
                key={opportunity.id}
                href={`/dashboard/opportunities/${opportunity.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">
                    {opportunity.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {opportunity.accountName ?? "Sans compte"} ·{" "}
                    {opportunity.ownerName ?? "Non assignée"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    value={opportunity.stage}
                    label={
                      opportunityStageLabels[opportunity.stage] ??
                      opportunity.stage
                    }
                  />
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrency(opportunity.amount)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </DetailCard>
      </div>

      <div className="px-4 lg:px-6">
        <DetailCard
          title="Activités récentes"
          action={
            <Link
              href="/dashboard/activities"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Tout voir
            </Link>
          }
        >
          <div className="flex flex-col gap-3">
            {data.recentActivities.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune activité enregistrée.
              </p>
            )}
            {data.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <StatusBadge
                    value={activity.type}
                    label={activityTypeLabels[activity.type] ?? activity.type}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {activity.subject}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {activity.userName ?? "—"}
                    </span>
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
