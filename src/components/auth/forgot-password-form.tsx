"use client"

import { useState } from "react"
import Link from "next/link"
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
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/schemas/auth"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setServerError(null)

    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password",
    })

    if (error) {
      setServerError("Demande impossible. Merci de réessayer.")
      return
    }

    setSubmittedEmail(data.email)
  }

  if (submittedEmail) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEndIcon className="size-6" />
            </div>
            <h1 className="text-xl font-bold">Check your inbox</h1>
            <FieldDescription>
              If an account exists for <strong>{submittedEmail}</strong>, a
              password reset link is on its way.
            </FieldDescription>
          </div>
          <Field>
            <Button type="button" variant="outline" render={<Link href="/sign-in" />}>
              Back to sign in
            </Button>
          </Field>
        </FieldGroup>
      </div>
    )
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
            <h1 className="text-xl font-bold">Reset your password</h1>
            <FieldDescription>
              Enter your email and we&apos;ll send you a reset link.
            </FieldDescription>
          </div>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="m@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <FieldError errors={serverError ? [{ message: serverError }] : []} />

          <Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send reset link"}
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Remembered it? <Link href="/sign-in">Sign in</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}
