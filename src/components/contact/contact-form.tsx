"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2Icon, SendIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"

import { submitContact } from "@/app/contact/actions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema, type ContactFormData } from "@/lib/schemas/contact"

export function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [submittedName, setSubmittedName] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  })

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setServerError(null)

    try {
      const result = await submitContact(data)

      if (!result.success) {
        setServerError(result.message)
        return
      }

      setSubmittedName(data.name)
      reset()
    } catch {
      setServerError("Une erreur est survenue. Merci de réessayer.")
    }
  }

  function handleReset() {
    reset()
    setServerError(null)
    setSubmittedName(null)
  }

  if (submittedName) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl bg-muted/50 p-8">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2Icon />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium">Merci {submittedName} !</h2>
          <p className="text-sm text-muted-foreground">
            On a bien reçu votre demande et on vous recontacte sous 24 h
            ouvrées.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={handleReset}>
          Envoyer un autre message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nom complet</FieldLabel>
            <Input
              id="name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email professionnel</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>
        </div>

        <Field data-invalid={!!errors.company}>
          <FieldLabel htmlFor="company">Entreprise</FieldLabel>
          <Input
            id="company"
            autoComplete="organization"
            aria-invalid={!!errors.company}
            {...register("company")}
          />
          <FieldDescription>Optionnel</FieldDescription>
          <FieldError errors={[errors.company]} />
        </Field>

        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor="message">Votre besoin</FieldLabel>
          <Textarea
            id="message"
            rows={5}
            placeholder="Où en êtes-vous ? Quels outils utilisez-vous aujourd’hui ?"
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          <FieldError errors={[errors.message]} />
        </Field>

        <FieldError errors={serverError ? [{ message: serverError }] : []} />

        <Field>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            <SendIcon data-icon="inline-start" />
            {isSubmitting ? "Envoi en cours…" : "Envoyer ma demande"}
          </Button>
          <FieldDescription>
            30 min • Sans engagement • Recommandations concrètes à la fin
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
