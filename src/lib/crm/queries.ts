import "server-only"

import { prisma } from "@/lib/prisma"
import { type CrmContext } from "@/lib/crm/context"

const num = (value: unknown) => (value === null || value === undefined ? null : Number(value))

export type Option = { label: string; value: string }

async function ownerOptions(organizationId: string): Promise<Option[]> {
  const members = await prisma.member.findMany({
    where: { organizationId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  })
  return members.map((member) => ({ label: member.user.name, value: member.user.id }))
}

export async function getAccountOptions(organizationId: string): Promise<Option[]> {
  const accounts = await prisma.crmAccount.findMany({
    where: { organizationId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
  return accounts.map((account) => ({ label: account.name, value: account.id }))
}

export async function getContactOptions(organizationId: string): Promise<Option[]> {
  const contacts = await prisma.contact.findMany({
    where: { organizationId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return contacts.map((contact) => ({
    label: `${contact.firstName} ${contact.lastName}`,
    value: contact.id,
  }))
}

export async function getProductOptions(organizationId: string): Promise<Option[]> {
  const products = await prisma.product.findMany({
    where: { organizationId },
    select: { id: true, name: true, sku: true },
    orderBy: { name: "asc" },
  })
  return products.map((product) => ({
    label: `${product.name} (${product.sku})`,
    value: product.id,
  }))
}

export async function getServiceOptions(organizationId: string): Promise<Option[]> {
  const services = await prisma.service.findMany({
    where: { organizationId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
  return services.map((service) => ({ label: service.name, value: service.id }))
}

export async function getOpportunityOptions(organizationId: string): Promise<Option[]> {
  const opportunities = await prisma.opportunity.findMany({
    where: { organizationId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
  return opportunities.map((opportunity) => ({
    label: opportunity.name,
    value: opportunity.id,
  }))
}

export async function getLeadOptions(organizationId: string): Promise<Option[]> {
  const leads = await prisma.lead.findMany({
    where: { organizationId },
    select: { id: true, firstName: true, lastName: true, company: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return leads.map((lead) => ({
    label: `${lead.firstName} ${lead.lastName}${lead.company ? ` · ${lead.company}` : ""}`,
    value: lead.id,
  }))
}

export async function getOrderOptions(organizationId: string): Promise<Option[]> {
  const orders = await prisma.order.findMany({
    where: { organizationId },
    select: { id: true, orderNumber: true },
    orderBy: { orderNumber: "desc" },
  })
  return orders.map((order) => ({
    label: order.orderNumber,
    value: order.id,
  }))
}

export async function getEmployeeOptions(organizationId: string): Promise<Option[]> {
  return ownerOptions(organizationId)
}

export function serializeUser(user: {
  id: string
  name: string
  email: string
  role: string | null
  department: string | null
  jobTitle: string | null
  phone: string | null
  managerId: string | null
  createdAt: Date
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? "AGENT",
    department: user.department,
    jobTitle: user.jobTitle,
    phone: user.phone,
    managerId: user.managerId,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function listAccounts(organizationId: string) {
  const accounts = await prisma.crmAccount.findMany({
    where: { organizationId },
    include: {
      owner: { select: { name: true } },
      _count: { select: { contacts: true, opportunities: true, orders: true } },
    },
    orderBy: { name: "asc" },
  })

  return accounts.map((account) => ({
    id: account.id,
    name: account.name,
    type: account.type,
    industry: account.industry,
    city: account.city,
    country: account.country,
    website: account.website,
    email: account.email,
    phone: account.phone,
    annualRevenue: num(account.annualRevenue),
    employeeCount: account.employeeCount,
    ownerId: account.ownerId,
    ownerName: account.owner?.name ?? null,
    contactCount: account._count.contacts,
    opportunityCount: account._count.opportunities,
    orderCount: account._count.orders,
  }))
}

export type AccountRow = Awaited<ReturnType<typeof listAccounts>>[number]

export async function getAccount(organizationId: string, id: string) {
  const account = await prisma.crmAccount.findFirst({
    where: { id, organizationId },
    include: {
      owner: { select: { name: true } },
      contacts: { orderBy: { lastName: "asc" } },
      opportunities: { orderBy: { createdAt: "desc" } },
      orders: { orderBy: { orderDate: "desc" } },
      services: { include: { service: true } },
      activities: {
        orderBy: { occurredAt: "desc" },
        include: { user: { select: { name: true } } },
        take: 20,
      },
    },
  })

  if (!account) return null

  return {
    id: account.id,
    name: account.name,
    type: account.type,
    industry: account.industry,
    website: account.website,
    email: account.email,
    phone: account.phone,
    address: account.address,
    city: account.city,
    state: account.state,
    country: account.country,
    postalCode: account.postalCode,
    annualRevenue: num(account.annualRevenue),
    employeeCount: account.employeeCount,
    description: account.description,
    ownerName: account.owner?.name ?? null,
    contacts: account.contacts.map((contact) => ({
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName}`,
      email: contact.email,
      jobTitle: contact.jobTitle,
      phone: contact.phone,
    })),
    opportunities: account.opportunities.map((opportunity) => ({
      id: opportunity.id,
      name: opportunity.name,
      stage: opportunity.stage,
      amount: num(opportunity.amount),
      closeDate: opportunity.closeDate?.toISOString() ?? null,
    })),
    orders: account.orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: num(order.total),
      orderDate: order.orderDate.toISOString(),
    })),
    services: account.services.map((entry) => ({
      id: entry.id,
      name: entry.service.name,
      status: entry.status,
      startedAt: entry.startedAt.toISOString(),
    })),
    activities: account.activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      subject: activity.subject,
      notes: activity.notes,
      occurredAt: activity.occurredAt.toISOString(),
      userName: activity.user?.name ?? null,
    })),
  }
}

export async function listContacts(organizationId: string) {
  const contacts = await prisma.contact.findMany({
    where: { organizationId },
    include: {
      account: { select: { name: true } },
      owner: { select: { name: true } },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })

  return contacts.map((contact) => ({
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    name: `${contact.firstName} ${contact.lastName}`,
    email: contact.email,
    phone: contact.phone,
    mobile: contact.mobile,
    jobTitle: contact.jobTitle,
    city: contact.city,
    country: contact.country,
    accountId: contact.accountId,
    accountName: contact.account?.name ?? null,
    ownerId: contact.ownerId,
    ownerName: contact.owner?.name ?? null,
  }))
}

export type ContactRow = Awaited<ReturnType<typeof listContacts>>[number]

export async function listLeads(organizationId: string) {
  const leads = await prisma.lead.findMany({
    where: { organizationId },
    include: { owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return leads.map((lead) => ({
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    name: `${lead.firstName} ${lead.lastName}`,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    status: lead.status,
    estimatedValue: num(lead.estimatedValue),
    ownerId: lead.ownerId,
    ownerName: lead.owner?.name ?? null,
    convertedAt: lead.convertedAt?.toISOString() ?? null,
  }))
}

export type LeadRow = Awaited<ReturnType<typeof listLeads>>[number]

export async function listOpportunities(organizationId: string) {
  const opportunities = await prisma.opportunity.findMany({
    where: { organizationId },
    include: {
      account: { select: { name: true } },
      owner: { select: { name: true } },
      _count: { select: { lineItems: true, contacts: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return opportunities.map((opportunity) => ({
    id: opportunity.id,
    name: opportunity.name,
    accountId: opportunity.accountId,
    accountName: opportunity.account?.name ?? null,
    ownerId: opportunity.ownerId,
    ownerName: opportunity.owner?.name ?? null,
    stage: opportunity.stage,
    amount: num(opportunity.amount),
    probability: opportunity.probability,
    closeDate: opportunity.closeDate?.toISOString() ?? null,
    description: opportunity.description,
    itemCount: opportunity._count.lineItems,
    contactCount: opportunity._count.contacts,
  }))
}

export type OpportunityRow = Awaited<ReturnType<typeof listOpportunities>>[number]

export async function getOpportunity(organizationId: string, id: string) {
  const opportunity = await prisma.opportunity.findFirst({
    where: { id, organizationId },
    include: {
      account: { select: { name: true } },
      owner: { select: { name: true } },
      lineItems: { include: { product: true } },
      contacts: { include: { contact: true } },
      activities: {
        orderBy: { occurredAt: "desc" },
        include: { user: { select: { name: true } } },
        take: 20,
      },
    },
  })

  if (!opportunity) return null

  return {
    id: opportunity.id,
    name: opportunity.name,
    accountId: opportunity.accountId,
    accountName: opportunity.account?.name ?? null,
    ownerId: opportunity.ownerId,
    ownerName: opportunity.owner?.name ?? null,
    stage: opportunity.stage,
    amount: num(opportunity.amount),
    probability: opportunity.probability,
    closeDate: opportunity.closeDate?.toISOString() ?? null,
    description: opportunity.description,
    lineItems: opportunity.lineItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: num(item.unitPrice),
      discount: num(item.discount),
    })),
    contacts: opportunity.contacts.map((entry) => ({
      id: entry.id,
      contactId: entry.contactId,
      name: `${entry.contact.firstName} ${entry.contact.lastName}`,
      role: entry.role,
      isPrimary: entry.isPrimary,
    })),
    activities: opportunity.activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      subject: activity.subject,
      notes: activity.notes,
      occurredAt: activity.occurredAt.toISOString(),
      userName: activity.user?.name ?? null,
    })),
  }
}

export async function listProducts(organizationId: string) {
  const products = await prisma.product.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
  })

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description,
    price: num(product.price),
    cost: num(product.cost),
    stock: product.stock,
    status: product.status,
  }))
}

export type ProductRow = Awaited<ReturnType<typeof listProducts>>[number]

export async function listServices(organizationId: string) {
  const services = await prisma.service.findMany({
    where: { organizationId },
    include: {
      product: { select: { name: true } },
      _count: { select: { accounts: true } },
    },
    orderBy: { name: "asc" },
  })

  return services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    price: num(service.price),
    status: service.status,
    productId: service.productId,
    productName: service.product?.name ?? null,
    accountCount: service._count.accounts,
  }))
}

export type ServiceRow = Awaited<ReturnType<typeof listServices>>[number]

export async function listOrders(organizationId: string) {
  const orders = await prisma.order.findMany({
    where: { organizationId },
    include: {
      account: { select: { name: true } },
      owner: { select: { name: true } },
      _count: { select: { items: true } },
    },
    orderBy: { orderDate: "desc" },
  })

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    accountId: order.accountId,
    accountName: order.account?.name ?? null,
    contactId: order.contactId,
    opportunityId: order.opportunityId,
    ownerId: order.ownerId,
    ownerName: order.owner?.name ?? null,
    status: order.status,
    orderDate: order.orderDate.toISOString(),
    total: num(order.total),
    itemCount: order._count.items,
  }))
}

export type OrderRow = Awaited<ReturnType<typeof listOrders>>[number]

export async function getOrder(organizationId: string, id: string) {
  const order = await prisma.order.findFirst({
    where: { id, organizationId },
    include: {
      account: { select: { name: true } },
      contact: { select: { firstName: true, lastName: true } },
      owner: { select: { name: true } },
      items: { include: { product: true } },
    },
  })

  if (!order) return null

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    accountName: order.account?.name ?? null,
    contactName: order.contact
      ? `${order.contact.firstName} ${order.contact.lastName}`
      : null,
    ownerName: order.owner?.name ?? null,
    status: order.status,
    orderDate: order.orderDate.toISOString(),
    total: num(order.total),
    notes: order.notes,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: num(item.unitPrice),
      subtotal: num(item.subtotal),
    })),
  }
}

export async function listActivities(organizationId: string) {
  const activities = await prisma.activity.findMany({
    where: { organizationId },
    include: {
      user: { select: { name: true } },
      account: { select: { name: true } },
      contact: { select: { firstName: true, lastName: true } },
      lead: { select: { firstName: true, lastName: true } },
      opportunity: { select: { name: true } },
    },
    orderBy: { occurredAt: "desc" },
    take: 100,
  })

  return activities.map((activity) => ({
    id: activity.id,
    type: activity.type,
    subject: activity.subject,
    notes: activity.notes,
    occurredAt: activity.occurredAt.toISOString(),
    userName: activity.user?.name ?? null,
    accountId: activity.accountId,
    accountName: activity.account?.name ?? null,
    contactId: activity.contactId,
    contactName: activity.contact
      ? `${activity.contact.firstName} ${activity.contact.lastName}`
      : null,
    leadId: activity.leadId,
    leadName: activity.lead
      ? `${activity.lead.firstName} ${activity.lead.lastName}`
      : null,
    opportunityId: activity.opportunityId,
    opportunityName: activity.opportunity?.name ?? null,
  }))
}

export type ActivityRow = Awaited<ReturnType<typeof listActivities>>[number]

export async function listEmployees(organizationId: string) {
  const members = await prisma.member.findMany({
    where: { organizationId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  })

  return members.map((member) => ({
    ...serializeUser(member.user),
    memberId: member.id,
    memberRole: member.role,
  }))
}

export type EmployeeRow = Awaited<ReturnType<typeof listEmployees>>[number]

export async function getDashboardData(context: CrmContext) {
  const organizationId = context.organizationId
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const openStages = [
    "PROSPECTING",
    "QUALIFICATION",
    "PROPOSAL",
    "NEGOTIATION",
  ] as const

  const [
    accountCount,
    contactCount,
    openOpportunities,
    wonThisMonth,
    pendingOrders,
    leadsToQualify,
    pipeline,
    recentOpportunities,
    recentActivities,
  ] = await Promise.all([
    prisma.crmAccount.count({ where: { organizationId } }),
    prisma.contact.count({ where: { organizationId } }),
    prisma.opportunity.aggregate({
      where: { organizationId, stage: { in: [...openStages] } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.opportunity.aggregate({
      where: {
        organizationId,
        stage: "CLOSED_WON",
        updatedAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: {
        organizationId,
        status: { in: ["PENDING", "CONFIRMED", "SHIPPED"] },
      },
      _sum: { total: true },
      _count: true,
    }),
    prisma.lead.count({
      where: { organizationId, status: { in: ["NEW", "CONTACTED"] } },
    }),
    prisma.opportunity.groupBy({
      by: ["stage"],
      where: { organizationId },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.opportunity.findMany({
      where: { organizationId },
      include: {
        account: { select: { name: true } },
        owner: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.activity.findMany({
      where: { organizationId },
      include: { user: { select: { name: true } } },
      orderBy: { occurredAt: "desc" },
      take: 6,
    }),
  ])

  return {
    organizationName: context.organizationName,
    accountCount,
    contactCount,
    openPipeline: {
      count: openOpportunities._count,
      amount: num(openOpportunities._sum.amount) ?? 0,
    },
    wonThisMonth: {
      count: wonThisMonth._count,
      amount: num(wonThisMonth._sum.amount) ?? 0,
    },
    pendingOrders: {
      count: pendingOrders._count,
      amount: num(pendingOrders._sum.total) ?? 0,
    },
    leadsToQualify,
    pipeline: pipeline.map((entry) => ({
      stage: entry.stage,
      count: entry._count,
      amount: num(entry._sum.amount) ?? 0,
    })),
    recentOpportunities: recentOpportunities.map((opportunity) => ({
      id: opportunity.id,
      name: opportunity.name,
      stage: opportunity.stage,
      amount: num(opportunity.amount),
      accountName: opportunity.account?.name ?? null,
      ownerName: opportunity.owner?.name ?? null,
    })),
    recentActivities: recentActivities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      subject: activity.subject,
      occurredAt: activity.occurredAt.toISOString(),
      userName: activity.user?.name ?? null,
    })),
  }
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>

export async function listOrganizationsForUser(userId: string) {
  const memberships = await prisma.member.findMany({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  })

  return memberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    role: membership.role,
  }))
}

export async function listMembers(organizationId: string) {
  return prisma.member.findMany({
    where: { organizationId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  })
}

export async function listInvitations(organizationId: string) {
  const invitations = await prisma.invitation.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  })

  return invitations.map((invitation) => ({
    id: invitation.id,
    email: invitation.email,
    role: invitation.role ?? "member",
    status: invitation.status,
    expiresAt: invitation.expiresAt.toISOString(),
    createdAt: invitation.createdAt.toISOString(),
  }))
}
