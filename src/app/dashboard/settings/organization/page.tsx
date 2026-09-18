import { PageHeader } from "@/components/crm/page-header"
import { isAdmin, requireCrmContext } from "@/lib/crm/context"
import { listInvitations, listMembers } from "@/lib/crm/queries"
import { prisma } from "@/lib/prisma"

import {
  InvitationsCard,
  MembersTable,
  OrganizationForm,
} from "./organization-settings-client"

export default async function OrganizationSettingsPage() {
  const context = await requireCrmContext()
  const admin = isAdmin(context)

  const [organization, members, invitations] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: context.organizationId },
      select: { name: true, slug: true, logo: true },
    }),
    listMembers(context.organizationId),
    listInvitations(context.organizationId),
  ])

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader
        title="Organisation"
        description="Gérez le portail, ses membres et les invitations."
      />

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
        <OrganizationForm
          organization={
            organization ?? { name: context.organizationName, slug: context.organizationSlug, logo: null }
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
        <MembersTable
          members={members.map((member) => ({
            id: member.id,
            name: member.user.name,
            email: member.user.email,
            memberRole: member.role,
          }))}
          isAdmin={admin}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
        <InvitationsCard invitations={invitations} isAdmin={admin} />
      </div>
    </div>
  )
}
