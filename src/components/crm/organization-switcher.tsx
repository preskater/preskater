"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"

export type OrganizationSummary = {
  id: string
  name: string
  slug: string
  role: string
}

export function OrganizationSwitcher({
  organizations,
  activeId,
  canCreate,
}: {
  organizations: OrganizationSummary[]
  activeId: string
  canCreate: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const active =
    organizations.find((organization) => organization.id === activeId) ??
    organizations[0]

  async function handleSwitch(id: string) {
    setPending(true)
    await authClient.organization.setActive({ organizationId: id })
    setPending(false)
    router.refresh()
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const slug = String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase()

    const { error } = await authClient.organization.create({ name, slug })

    if (error) {
      setError(error.message ?? "La création de l'organisation a échoué.")
      return
    }

    setOpen(false)
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent"
              />
            }
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              {active?.name.slice(0, 2).toUpperCase() ?? "?"}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {active?.name ?? "Aucune organisation"}
              </span>
              <span className="truncate text-xs text-foreground/70">
                {active?.slug ?? "—"}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel>Organisations</DropdownMenuLabel>
            {organizations.map((organization) => (
              <DropdownMenuItem
                key={organization.id}
                disabled={pending}
                onClick={() => handleSwitch(organization.id)}
              >
                {organization.name}
                {organization.id === activeId && (
                  <CheckIcon className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
            {canCreate && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <PlusIcon />
                  Nouvelle organisation
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une organisation</DialogTitle>
              <DialogDescription>
                Une organisation (portail) regroupe vos comptes, contacts et
                opportunités.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <FieldGroup>
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="org-name">Nom</FieldLabel>
                  <Input id="org-name" name="name" required />
                </Field>
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="org-slug">Identifiant</FieldLabel>
                  <Input
                    id="org-slug"
                    name="slug"
                    required
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    placeholder="mon-organisation"
                  />
                  <FieldError errors={error ? [{ message: error }] : []} />
                </Field>
              </FieldGroup>
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Créer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
