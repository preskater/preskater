import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const tones: Record<string, string> = {
  green:
    "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  blue: "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400",
  amber:
    "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  red: "border-transparent bg-red-500/15 text-red-700 dark:text-red-400",
  violet:
    "border-transparent bg-violet-500/15 text-violet-700 dark:text-violet-400",
  slate: "border-transparent bg-muted text-muted-foreground",
}

export type BadgeTone = keyof typeof tones

export const statusTones: Record<string, BadgeTone> = {
  PROSPECT: "slate",
  CUSTOMER: "green",
  PARTNER: "violet",
  SUPPLIER: "blue",

  NEW: "blue",
  CONTACTED: "amber",
  QUALIFIED: "violet",
  UNQUALIFIED: "slate",
  CONVERTED: "green",

  PROSPECTING: "slate",
  QUALIFICATION: "blue",
  PROPOSAL: "amber",
  NEGOTIATION: "violet",
  CLOSED_WON: "green",
  CLOSED_LOST: "red",

  ACTIVE: "green",
  INACTIVE: "slate",
  DISCONTINUED: "red",
  DEPRECATED: "red",
  PAUSED: "amber",
  CANCELLED: "red",

  DRAFT: "slate",
  PENDING: "amber",
  CONFIRMED: "blue",
  SHIPPED: "violet",
  COMPLETED: "green",
  PENDING_PAYMENT: "amber",

  CALL: "blue",
  EMAIL: "violet",
  MEETING: "amber",
  NOTE: "slate",
  TASK: "green",
}

export function StatusBadge({
  value,
  label,
  className,
}: {
  value: string
  label: string
  className?: string
}) {
  const tone = statusTones[value] ?? "slate"
  return (
    <Badge variant="outline" className={cn(tones[tone], className)}>
      {label}
    </Badge>
  )
}
