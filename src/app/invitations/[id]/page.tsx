import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { memberRoleLabels, formatDate } from "@/lib/crm/labels"
import { prisma } from "@/lib/prisma"

import { InvitationActions, InvitationNotice } from "./invitation-actions"

export default async function InvitationPage({
  params,
}: PageProps<"/invitations/[id]">) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(`/sign-in?callbackUrl=/invitations/${id}`)
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: {
      organization: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
  })

  const now = new Date()

  if (
    !invitation ||
    invitation.status !== "pending" ||
    invitation.expiresAt < now
  ) {
    return (
      <InvitationNotice
        title="Invitation introuvable"
        description="Cette invitation n'existe pas, a déjà été traitée ou a expiré."
      />
    )
  }

  if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) {
    return (
      <InvitationNotice
        title="Invitation pour un autre compte"
        description={`Cette invitation a été envoyée à ${invitation.email}. Connectez-vous avec ce compte pour l'accepter.`}
        email={session.user.email}
      />
    )
  }

  return (
    <InvitationActions
      invitationId={invitation.id}
      organizationName={invitation.organization.name}
      roleLabel={memberRoleLabels[invitation.role ?? "member"] ?? "Membre"}
      inviterName={invitation.user.name}
      expiresAt={formatDate(invitation.expiresAt)}
    />
  )
}
