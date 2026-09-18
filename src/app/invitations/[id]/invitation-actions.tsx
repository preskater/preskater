"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckIcon, LoaderIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"

export function InvitationNotice({
  title,
  description,
  email,
}: {
  title: string
  description: string
  email?: string
}) {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {email && (
            <p className="text-sm text-muted-foreground">
              Connecté en tant que{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {email && (
              <Button variant="outline" onClick={handleSignOut}>
                Changer de compte
              </Button>
            )}
            <Button render={<Link href="/dashboard" />}>Aller au tableau de bord</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function InvitationActions({
  invitationId,
  organizationName,
  roleLabel,
  inviterName,
  expiresAt,
}: {
  invitationId: string
  organizationName: string
  roleLabel: string
  inviterName: string
  expiresAt: string
}) {
  const router = useRouter()
  const [pending, setPending] = React.useState<"accept" | "reject" | null>(null)

  async function handleAccept() {
    setPending("accept")
    const { error } = await authClient.organization.acceptInvitation({
      invitationId,
    })

    if (error) {
      setPending(null)
      toast.error(
        error.code === "EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION"
          ? "Vérifiez votre email avant d'accepter cette invitation."
          : "L'acceptation de l'invitation a échoué."
      )
      return
    }

    toast.success(`Bienvenue dans ${organizationName} !`)
    router.push("/dashboard")
    router.refresh()
  }

  async function handleReject() {
    setPending("reject")
    const { error } = await authClient.organization.rejectInvitation({
      invitationId,
    })

    if (error) {
      setPending(null)
      toast.error("Le refus de l'invitation a échoué.")
      return
    }

    toast.success("Invitation refusée.")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invitation à rejoindre {organizationName}</CardTitle>
          <CardDescription>
            {inviterName} vous invite en tant que {roleLabel.toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">Organisation</dt>
              <dd className="font-medium">{organizationName}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">Rôle</dt>
              <dd className="font-medium">{roleLabel}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">Invité par</dt>
              <dd className="font-medium">{inviterName}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">Expire le</dt>
              <dd className="font-medium">{expiresAt}</dd>
            </div>
          </dl>
          <Separator />
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={pending !== null}
            >
              {pending === "reject" ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <XIcon />
              )}
              Refuser
            </Button>
            <Button onClick={handleAccept} disabled={pending !== null}>
              {pending === "accept" ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <CheckIcon />
              )}
              Accepter l&apos;invitation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
