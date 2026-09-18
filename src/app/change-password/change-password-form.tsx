"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { GalleryVerticalEndIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/schemas/auth"
import { changeInitialPassword } from "./actions"

export function ChangePasswordForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    setServerError(null)

    const result = await changeInitialPassword(data)

    if (!result.success) {
      setServerError(result.message)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEndIcon className="size-6" />
            </div>
            <h1 className="text-xl font-bold">Choisissez votre mot de passe</h1>
            <FieldDescription>
              Pour des raisons de sécurité, vous devez remplacer le mot de passe
              initial avant d&apos;accéder à l&apos;application.
            </FieldDescription>
          </div>

          <Field data-invalid={!!errors.currentPassword}>
            <FieldLabel htmlFor="currentPassword">
              Mot de passe actuel
            </FieldLabel>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.currentPassword}
              {...register("currentPassword")}
            />
            <FieldError errors={[errors.currentPassword]} />
          </Field>

          <Field data-invalid={!!errors.newPassword}>
            <FieldLabel htmlFor="newPassword">Nouveau mot de passe</FieldLabel>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
            <FieldDescription>8 caractères minimum.</FieldDescription>
            <FieldError errors={[errors.newPassword]} />
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">
              Confirmer le mot de passe
            </FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>

          <FieldError errors={serverError ? [{ message: serverError }] : []} />

          <Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
