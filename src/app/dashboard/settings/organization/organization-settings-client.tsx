"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, MailPlusIcon, XIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import { DetailCard } from "@/components/crm/detail-card"
import { StatusBadge } from "@/components/crm/status-badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/crm/labels"
import { memberRoleLabels } from "@/lib/crm/labels"
import {
  organizationSchema,
  type OrganizationFormData,
} from "@/lib/schemas/crm"
import type { ActionResult } from "@/lib/crm/types"
import {
  cancelInvitation,
  inviteMember,
  updateOrganization,
} from "./actions"

type Member = {
  id: string
  name: string
  email: string
  memberRole: string
}

type Invitation = {
  id: string
  email: string
  role: string
  status: string
  expiresAt: string
}

export function OrganizationForm({
  organization,
}: {
  organization: { name: string; slug: string; logo: string | null }
}) {
  const router = useRouter()
  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema) as never,
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo ?? "",
    },
  })

  const onSubmit: SubmitHandler<OrganizationFormData> = async (values) => {
    const result = await updateOrganization(values)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success(result.message ?? "Organisation mise à jour.")
    router.refresh()
  }

  return (
    <DetailCard
      title="Profil de l'organisation"
      description="Nom, identifiant et logo du portail CRM."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="org-name">Nom</FieldLabel>
              <Input id="org-name" {...form.register("name")} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.slug}>
              <FieldLabel htmlFor="org-slug">Identifiant</FieldLabel>
              <Input id="org-slug" {...form.register("slug")} />
              <FieldError errors={[form.formState.errors.slug]} />
            </Field>
            <Field
              data-invalid={!!form.formState.errors.logo}
              className="sm:col-span-2"
            >
              <FieldLabel htmlFor="org-logo">URL du logo</FieldLabel>
              <Input id="org-logo" {...form.register("logo")} />
              <FieldError errors={[form.formState.errors.logo]} />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <LoaderIcon className="animate-spin" />
              )}
              Enregistrer
            </Button>
          </div>
        </FieldGroup>
      </form>
    </DetailCard>
  )
}

export function MembersTable({
  members,
  isAdmin,
}: {
  members: Member[]
  isAdmin: boolean
}) {
  return (
    <DetailCard
      title="Membres"
      description={`${members.length} membre(s)`}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {member.email}
              </TableCell>
              <TableCell>
                <StatusBadge
                  value={member.memberRole === "member" ? "ACTIVE" : "PROPOSAL"}
                  label={
                    memberRoleLabels[member.memberRole] ?? member.memberRole
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isAdmin && (
        <p className="mt-3 text-xs text-muted-foreground">
          Seuls les administrateurs peuvent inviter ou gérer les membres.
        </p>
      )}
    </DetailCard>
  )
}

export function InvitationsCard({
  invitations,
  isAdmin,
}: {
  invitations: Invitation[]
  isAdmin: boolean
}) {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<"owner" | "admin" | "member">("member")
  const [pending, setPending] = React.useState(false)

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    const result: ActionResult = await inviteMember({ email, role })
    setPending(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success(result.message ?? "Invitation envoyée.")
    setEmail("")
    router.refresh()
  }

  return (
    <DetailCard
      title="Invitations"
      description="Invitez de nouveaux membres par email."
    >
      {isAdmin && (
        <form onSubmit={handleInvite} className="mb-4 flex flex-wrap gap-2">
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@exemple.fr"
            className="min-w-48 flex-1"
          />
          <Select
            items={[
              { label: "Membre", value: "member" },
              { label: "Administrateur", value: "admin" },
              { label: "Propriétaire", value: "owner" },
            ]}
            value={role}
            onValueChange={(value) =>
              setRole((value ?? "member") as typeof role)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Membre</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={pending}>
            {pending ? <LoaderIcon className="animate-spin" /> : <MailPlusIcon />}
            Inviter
          </Button>
        </form>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Expire</TableHead>
            <TableHead className="w-[1%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Aucune invitation en attente.
              </TableCell>
            </TableRow>
          )}
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                {memberRoleLabels[invitation.role] ?? invitation.role}
              </TableCell>
              <TableCell>
                <StatusBadge
                  value={invitation.status === "pending" ? "PENDING" : "ACTIVE"}
                  label={
                    invitation.status === "pending" ? "En attente" : "Acceptée"
                  }
                />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(invitation.expiresAt)}
              </TableCell>
              <TableCell className="text-right">
                {isAdmin && invitation.status === "pending" && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={async () => {
                      const result = await cancelInvitation(invitation.id)
                      if (!result.success) {
                        toast.error(result.message)
                        return
                      }
                      toast.success("Invitation annulée.")
                      router.refresh()
                    }}
                    aria-label="Annuler l'invitation"
                  >
                    <XIcon />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DetailCard>
  )
}
