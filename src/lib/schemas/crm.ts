import { z } from "zod"

const requiredString = (message = "Ce champ est requis") =>
  z.string().trim().min(1, message)

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))

const optionalId = z
  .string()
  .optional()
  .transform((value) => (value && value !== "" ? value : undefined))

const optionalInt = z
  .union([z.coerce.number().int(), z.literal(""), z.null()])
  .optional()
  .transform((value) =>
    value === "" || value === null || value === undefined
      ? undefined
      : Number(value)
  )

const optionalDecimal = z
  .union([z.coerce.number(), z.literal(""), z.null()])
  .optional()
  .transform((value) =>
    value === "" || value === null || value === undefined
      ? undefined
      : Number(value)
  )

const optionalDate = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (!value) return undefined
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date
  })

const email = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))
  .refine(
    (value) => !value || z.email().safeParse(value).success,
    "Entrez une adresse email valide"
  )

const money = z
  .union([z.coerce.number(), z.literal(""), z.null()])
  .optional()
  .transform((value) =>
    value === "" || value === null || value === undefined
      ? 0
      : Number(value)
  )

export const accountSchema = z.object({
  name: requiredString("Indiquez le nom du compte"),
  type: z.enum(["PROSPECT", "CUSTOMER", "PARTNER", "SUPPLIER"]),
  industry: optionalString,
  website: optionalString,
  phone: optionalString,
  email,
  address: optionalString,
  city: optionalString,
  state: optionalString,
  country: optionalString,
  postalCode: optionalString,
  annualRevenue: optionalDecimal,
  employeeCount: optionalInt,
  description: optionalString,
  ownerId: optionalId,
})
export type AccountFormData = z.infer<typeof accountSchema>

export const contactSchema = z.object({
  firstName: requiredString("Indiquez le prénom"),
  lastName: requiredString("Indiquez le nom"),
  email,
  phone: optionalString,
  mobile: optionalString,
  jobTitle: optionalString,
  address: optionalString,
  city: optionalString,
  state: optionalString,
  country: optionalString,
  postalCode: optionalString,
  notes: optionalString,
  accountId: optionalId,
  ownerId: optionalId,
})
export type ContactFormData = z.infer<typeof contactSchema>

export const leadSchema = z.object({
  firstName: requiredString("Indiquez le prénom"),
  lastName: requiredString("Indiquez le nom"),
  company: optionalString,
  email,
  phone: optionalString,
  jobTitle: optionalString,
  source: z.enum([
    "WEB",
    "REFERRAL",
    "COLD_CALL",
    "EVENT",
    "CAMPAIGN",
    "PARTNER",
    "OTHER",
  ]),
  status: z.enum([
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "UNQUALIFIED",
    "CONVERTED",
  ]),
  estimatedValue: optionalDecimal,
  notes: optionalString,
  ownerId: optionalId,
})
export type LeadFormData = z.infer<typeof leadSchema>

export const opportunitySchema = z.object({
  name: requiredString("Indiquez le nom de l'opportunité"),
  accountId: optionalId,
  ownerId: optionalId,
  stage: z.enum([
    "PROSPECTING",
    "QUALIFICATION",
    "PROPOSAL",
    "NEGOTIATION",
    "CLOSED_WON",
    "CLOSED_LOST",
  ]),
  amount: money,
  probability: z
    .union([z.coerce.number().int(), z.literal("")])
    .optional()
    .transform((value) => (value === "" || value === undefined ? 0 : Number(value))),
  closeDate: optionalDate,
  description: optionalString,
})
export type OpportunityFormData = z.infer<typeof opportunitySchema>

export const productSchema = z.object({
  name: requiredString("Indiquez le nom du produit"),
  sku: requiredString("Indiquez la référence (SKU)"),
  description: optionalString,
  price: money,
  cost: money,
  stock: z
    .union([z.coerce.number().int(), z.literal("")])
    .optional()
    .transform((value) => (value === "" || value === undefined ? 0 : Number(value))),
  status: z.enum(["ACTIVE", "INACTIVE", "DISCONTINUED"]),
})
export type ProductFormData = z.infer<typeof productSchema>

export const serviceSchema = z.object({
  name: requiredString("Indiquez le nom du service"),
  description: optionalString,
  price: money,
  status: z.enum(["ACTIVE", "INACTIVE", "DEPRECATED"]),
  productId: optionalId,
})
export type ServiceFormData = z.infer<typeof serviceSchema>

export const orderSchema = z.object({
  orderNumber: requiredString("Indiquez le numéro de commande"),
  accountId: optionalId,
  contactId: optionalId,
  opportunityId: optionalId,
  ownerId: optionalId,
  status: z.enum([
    "DRAFT",
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "COMPLETED",
    "CANCELLED",
  ]),
  orderDate: optionalDate,
  notes: optionalString,
})
export type OrderFormData = z.infer<typeof orderSchema>

export const orderItemSchema = z.object({
  productId: requiredString("Sélectionnez un produit"),
  quantity: z.coerce.number().int().min(1, "Quantité minimale : 1"),
  unitPrice: money,
})
export type OrderItemFormData = z.infer<typeof orderItemSchema>

export const opportunityLineItemSchema = z.object({
  productId: requiredString("Sélectionnez un produit"),
  quantity: z.coerce.number().int().min(1, "Quantité minimale : 1"),
  unitPrice: money,
  discount: money,
})
export type OpportunityLineItemFormData = z.infer<
  typeof opportunityLineItemSchema
>

export const activitySchema = z.object({
  type: z.enum(["CALL", "EMAIL", "MEETING", "NOTE", "TASK"]),
  subject: requiredString("Indiquez le sujet"),
  notes: optionalString,
  occurredAt: optionalDate,
  accountId: optionalId,
  contactId: optionalId,
  opportunityId: optionalId,
  leadId: optionalId,
  orderId: optionalId,
})
export type ActivityFormData = z.infer<typeof activitySchema>

export const accountServiceSchema = z.object({
  serviceId: requiredString("Sélectionnez un service"),
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED"]),
  startedAt: optionalDate,
  endedAt: optionalDate,
  notes: optionalString,
})
export type AccountServiceFormData = z.infer<typeof accountServiceSchema>

export const employeeSchema = z.object({
  name: requiredString("Indiquez le nom"),
  role: z.enum(["ADMIN", "MANAGER", "AGENT"]),
  department: z.enum([
    "SALES",
    "MARKETING",
    "SUPPORT",
    "OPERATIONS",
    "FINANCE",
  ]),
  jobTitle: optionalString,
  phone: optionalString,
  managerId: optionalId,
})
export type EmployeeFormData = z.infer<typeof employeeSchema>

export const organizationSchema = z.object({
  name: requiredString("Indiquez le nom de l'organisation"),
  slug: z
    .string()
    .trim()
    .min(2, "2 caractères minimum")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Utilisez des minuscules, chiffres et tirets"
    ),
  logo: z.string().trim().optional(),
})
export type OrganizationFormData = z.infer<typeof organizationSchema>
