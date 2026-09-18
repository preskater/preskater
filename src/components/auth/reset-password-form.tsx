"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { GalleryVerticalEndIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/schemas/auth"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
  })

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    setServerError(null)

    if (!token) {
      setServerError("Lien de réinitialisation invalide ou expiré.")
      return
    }

    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    })

    if (error) {
      setServerError(
        error.code === "INVALID_TOKEN" || error.code === "TOKEN_EXPIRED"
          ? "Lien de réinitialisation invalide ou expiré."
          : "Réinitialisation impossible. Merci de réessayer."
      )
      return
    }

    router.push("/sign-in")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6" />
              </div>
              <span className="sr-only">Preskater</span>
            </Link>
            <h1 className="text-xl font-bold">Choose a new password</h1>
            <FieldDescription>
              Your new password must be at least 8 characters long.
            </FieldDescription>
          </div>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
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
            <Button type="submit" disabled={isSubmitting || !token}>
              {isSubmitting ? "Updating…" : "Update password"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
