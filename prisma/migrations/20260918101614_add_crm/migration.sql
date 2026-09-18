-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('PROSPECT', 'CUSTOMER', 'PARTNER', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEB', 'REFERRAL', 'COLD_CALL', 'EVENT', 'CAMPAIGN', 'PARTNER', 'OTHER');

-- CreateEnum
CREATE TYPE "OpportunityStage" AS ENUM ('PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST');

-- CreateEnum
CREATE TYPE "ContactRole" AS ENUM ('DECISION_MAKER', 'INFLUENCER', 'CHAMPION', 'ECONOMIC_BUYER', 'TECHNICAL_BUYER', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PENDING', 'CONFIRMED', 'SHIPPED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK');

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "activeOrganizationId" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "department" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "managerId" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'AGENT';

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "metadata" TEXT,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviterId" TEXT NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_account" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT 'PROSPECT',
    "industry" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "annualRevenue" DECIMAL(14,2),
    "employeeCount" INTEGER,
    "description" TEXT,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "jobTitle" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "notes" TEXT,
    "accountId" TEXT,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'OTHER',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "estimatedValue" DECIMAL(14,2),
    "notes" TEXT,
    "ownerId" TEXT,
    "convertedAccountId" TEXT,
    "convertedContactId" TEXT,
    "convertedOpportunityId" TEXT,
    "convertedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountId" TEXT,
    "ownerId" TEXT,
    "stage" "OpportunityStage" NOT NULL DEFAULT 'PROSPECTING',
    "amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "probability" INTEGER NOT NULL DEFAULT 0,
    "closeDate" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_contact_role" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "role" "ContactRole" NOT NULL DEFAULT 'OTHER',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunity_contact_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "cost" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_line_item" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunity_line_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE',
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_service" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "account_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "accountId" TEXT,
    "contactId" TEXT,
    "opportunityId" TEXT,
    "ownerId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL DEFAULT 'NOTE',
    "subject" TEXT NOT NULL,
    "notes" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "accountId" TEXT,
    "contactId" TEXT,
    "opportunityId" TEXT,
    "leadId" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- CreateIndex
CREATE INDEX "member_organizationId_idx" ON "member"("organizationId");

-- CreateIndex
CREATE INDEX "member_userId_idx" ON "member"("userId");

-- CreateIndex
CREATE INDEX "invitation_organizationId_idx" ON "invitation"("organizationId");

-- CreateIndex
CREATE INDEX "invitation_email_idx" ON "invitation"("email");

-- CreateIndex
CREATE INDEX "crm_account_organizationId_idx" ON "crm_account"("organizationId");

-- CreateIndex
CREATE INDEX "crm_account_ownerId_idx" ON "crm_account"("ownerId");

-- CreateIndex
CREATE INDEX "crm_account_organizationId_name_idx" ON "crm_account"("organizationId", "name");

-- CreateIndex
CREATE INDEX "contact_organizationId_idx" ON "contact"("organizationId");

-- CreateIndex
CREATE INDEX "contact_accountId_idx" ON "contact"("accountId");

-- CreateIndex
CREATE INDEX "contact_ownerId_idx" ON "contact"("ownerId");

-- CreateIndex
CREATE INDEX "contact_organizationId_lastName_idx" ON "contact"("organizationId", "lastName");

-- CreateIndex
CREATE INDEX "lead_organizationId_idx" ON "lead"("organizationId");

-- CreateIndex
CREATE INDEX "lead_ownerId_idx" ON "lead"("ownerId");

-- CreateIndex
CREATE INDEX "lead_organizationId_status_idx" ON "lead"("organizationId", "status");

-- CreateIndex
CREATE INDEX "opportunity_organizationId_idx" ON "opportunity"("organizationId");

-- CreateIndex
CREATE INDEX "opportunity_accountId_idx" ON "opportunity"("accountId");

-- CreateIndex
CREATE INDEX "opportunity_ownerId_idx" ON "opportunity"("ownerId");

-- CreateIndex
CREATE INDEX "opportunity_organizationId_stage_idx" ON "opportunity"("organizationId", "stage");

-- CreateIndex
CREATE INDEX "opportunity_contact_role_contactId_idx" ON "opportunity_contact_role"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_contact_role_opportunityId_contactId_key" ON "opportunity_contact_role"("opportunityId", "contactId");

-- CreateIndex
CREATE INDEX "product_organizationId_idx" ON "product"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "product_organizationId_sku_key" ON "product"("organizationId", "sku");

-- CreateIndex
CREATE INDEX "opportunity_line_item_opportunityId_idx" ON "opportunity_line_item"("opportunityId");

-- CreateIndex
CREATE INDEX "opportunity_line_item_productId_idx" ON "opportunity_line_item"("productId");

-- CreateIndex
CREATE INDEX "service_organizationId_idx" ON "service"("organizationId");

-- CreateIndex
CREATE INDEX "service_productId_idx" ON "service"("productId");

-- CreateIndex
CREATE INDEX "account_service_serviceId_idx" ON "account_service"("serviceId");

-- CreateIndex
CREATE INDEX "account_service_organizationId_idx" ON "account_service"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "account_service_accountId_serviceId_key" ON "account_service"("accountId", "serviceId");

-- CreateIndex
CREATE INDEX "order_organizationId_idx" ON "order"("organizationId");

-- CreateIndex
CREATE INDEX "order_accountId_idx" ON "order"("accountId");

-- CreateIndex
CREATE INDEX "order_contactId_idx" ON "order"("contactId");

-- CreateIndex
CREATE INDEX "order_ownerId_idx" ON "order"("ownerId");

-- CreateIndex
CREATE INDEX "order_organizationId_status_idx" ON "order"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "order_organizationId_orderNumber_key" ON "order"("organizationId", "orderNumber");

-- CreateIndex
CREATE INDEX "order_item_orderId_idx" ON "order_item"("orderId");

-- CreateIndex
CREATE INDEX "order_item_productId_idx" ON "order_item"("productId");

-- CreateIndex
CREATE INDEX "activity_organizationId_idx" ON "activity"("organizationId");

-- CreateIndex
CREATE INDEX "activity_accountId_idx" ON "activity"("accountId");

-- CreateIndex
CREATE INDEX "activity_contactId_idx" ON "activity"("contactId");

-- CreateIndex
CREATE INDEX "activity_opportunityId_idx" ON "activity"("opportunityId");

-- CreateIndex
CREATE INDEX "activity_leadId_idx" ON "activity"("leadId");

-- CreateIndex
CREATE INDEX "activity_orderId_idx" ON "activity"("orderId");

-- CreateIndex
CREATE INDEX "activity_userId_idx" ON "activity"("userId");

-- CreateIndex
CREATE INDEX "user_managerId_idx" ON "user"("managerId");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_account" ADD CONSTRAINT "crm_account_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_account" ADD CONSTRAINT "crm_account_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "crm_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_convertedAccountId_fkey" FOREIGN KEY ("convertedAccountId") REFERENCES "crm_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_convertedContactId_fkey" FOREIGN KEY ("convertedContactId") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_convertedOpportunityId_fkey" FOREIGN KEY ("convertedOpportunityId") REFERENCES "opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "crm_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_contact_role" ADD CONSTRAINT "opportunity_contact_role_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_contact_role" ADD CONSTRAINT "opportunity_contact_role_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_line_item" ADD CONSTRAINT "opportunity_line_item_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_line_item" ADD CONSTRAINT "opportunity_line_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_service" ADD CONSTRAINT "account_service_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "crm_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_service" ADD CONSTRAINT "account_service_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_service" ADD CONSTRAINT "account_service_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "crm_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "crm_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
