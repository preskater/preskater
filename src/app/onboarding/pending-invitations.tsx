import Link from "next/link"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { memberRoleLabels } from "@/lib/crm/labels"
import { prisma } from "@/lib/prisma"

export async function PendingInvitations({
  email,
  emailVerified,
}: {
  email: string
  emailVerified: boolean
}) {
  const invitations = await prisma.invitation.findMany({
    where: {
      email: { equals: email, mode: "insensitive" },
      status: "pending",
      expiresAt: { gt: new Date() },
    },
    include: { organization: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Votre compte est actif</CardTitle>
        <CardDescription>
          {emailVerified
            ? "Vous n'êtes membre d'aucune organisation pour le moment. Demandez à un administrateur de vous inviter, ou acceptez une invitation en attente."
            : "Vérifiez votre adresse email grâce au lien fourni par un administrateur, puis connectez-vous pour rejoindre une organisation."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {invitations.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Invitations en attente</p>
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">
                    {invitation.organization.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {memberRoleLabels[invitation.role ?? "member"] ?? "Membre"}
                  </span>
                </div>
                <Button
                  size="sm"
                  render={<Link href={`/invitations/${invitation.id}`} />}
                >
                  Voir
                </Button>
              </div>
            ))}
          </div>
        )}

        <SignOutButton />
      </CardContent>
    </Card>
  )
}
