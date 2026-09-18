"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoaderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function OnboardingForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const organizationName = name.trim()
    const organizationSlug = (slug || slugify(organizationName)).trim()

    const { data, error } = await authClient.organization.create({
      name: organizationName,
      slug: organizationSlug,
    })

    if (error) {
      setError(error.message ?? "La création de l'organisation a échoué.")
      setPending(false)
      return
    }

    if (data?.id) {
      await authClient.organization.setActive({ organizationId: data.id })
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bienvenue sur Preskater CRM</CardTitle>
        <CardDescription>
          Créez votre espace de travail pour commencer à gérer vos comptes,
          contacts et opportunités.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="onboarding-name">
                Nom de l&apos;organisation
              </FieldLabel>
              <Input
                id="onboarding-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setSlug(slugify(event.target.value))
                }}
                placeholder="Mon entreprise"
                required
              />
            </Field>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="onboarding-slug">Identifiant</FieldLabel>
              <Input
                id="onboarding-slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="mon-entreprise"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                required
              />
              <FieldError errors={error ? [{ message: error }] : []} />
            </Field>
            <Button type="submit" disabled={pending}>
              {pending && <LoaderIcon className="animate-spin" />}
              Créer mon espace
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
