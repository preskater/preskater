export const accountTypeLabels: Record<string, string> = {
  PROSPECT: "Prospect",
  CUSTOMER: "Client",
  PARTNER: "Partenaire",
  SUPPLIER: "Fournisseur",
}

export const leadStatusLabels: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  QUALIFIED: "Qualifié",
  UNQUALIFIED: "Non qualifié",
  CONVERTED: "Converti",
}

export const leadSourceLabels: Record<string, string> = {
  WEB: "Site web",
  REFERRAL: "Recommandation",
  COLD_CALL: "Prospection téléphonique",
  EVENT: "Événement",
  CAMPAIGN: "Campagne",
  PARTNER: "Partenaire",
  OTHER: "Autre",
}

export const opportunityStageLabels: Record<string, string> = {
  PROSPECTING: "Prospection",
  QUALIFICATION: "Qualification",
  PROPOSAL: "Proposition",
  NEGOTIATION: "Négociation",
  CLOSED_WON: "Gagnée",
  CLOSED_LOST: "Perdue",
}

export const contactRoleLabels: Record<string, string> = {
  DECISION_MAKER: "Décideur",
  INFLUENCER: "Influenceur",
  CHAMPION: "Ambassadeur",
  ECONOMIC_BUYER: "Acheteur économique",
  TECHNICAL_BUYER: "Acheteur technique",
  OTHER: "Autre",
}

export const productStatusLabels: Record<string, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DISCONTINUED: "Abandonné",
}

export const serviceStatusLabels: Record<string, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DEPRECATED: "Obsolète",
}

export const subscriptionStatusLabels: Record<string, string> = {
  ACTIVE: "Actif",
  PAUSED: "En pause",
  CANCELLED: "Résilié",
}

export const orderStatusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  SHIPPED: "Expédiée",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
}

export const activityTypeLabels: Record<string, string> = {
  CALL: "Appel",
  EMAIL: "Email",
  MEETING: "Rendez-vous",
  NOTE: "Note",
  TASK: "Tâche",
}

export const userRoleLabels: Record<string, string> = {
  ADMIN: "Administrateur",
  MANAGER: "Manager",
  AGENT: "Agent",
}

export const departmentLabels: Record<string, string> = {
  SALES: "Commercial",
  MARKETING: "Marketing",
  SUPPORT: "Support",
  OPERATIONS: "Opérations",
  FINANCE: "Finance",
}

export function optionsFromLabels(
  labels: Record<string, string>
): { label: string; value: string }[] {
  return Object.entries(labels).map(([value, label]) => ({ label, value }))
}

export const accountTypeOptions = optionsFromLabels(accountTypeLabels)
export const leadStatusOptions = optionsFromLabels(leadStatusLabels)
export const leadSourceOptions = optionsFromLabels(leadSourceLabels)
export const opportunityStageOptions = optionsFromLabels(opportunityStageLabels)
export const contactRoleOptions = optionsFromLabels(contactRoleLabels)
export const productStatusOptions = optionsFromLabels(productStatusLabels)
export const serviceStatusOptions = optionsFromLabels(serviceStatusLabels)
export const subscriptionStatusOptions = optionsFromLabels(
  subscriptionStatusLabels
)
export const orderStatusOptions = optionsFromLabels(orderStatusLabels)
export const activityTypeOptions = optionsFromLabels(activityTypeLabels)
export const userRoleOptions = optionsFromLabels(userRoleLabels)
export const departmentOptions = optionsFromLabels(departmentLabels)

export function formatCurrency(value: unknown) {
  const amount = Number(value ?? 0)
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(value: unknown) {
  if (!value) return "—"
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date)
}

export function formatDateTime(value: unknown) {
  if (!value) return "—"
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}
