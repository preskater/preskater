"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { signUpSchema, type SignUpFormData } from "@/lib/schemas/auth"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    setServerError(null)

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
    })

    if (error) {
      setServerError(
        error.code === "USER_ALREADY_EXISTS"
          ? "Un compte existe déjà avec cette adresse email."
          : "Création du compte impossible. Merci de réessayer."
      )
      return
    }

    // The first account is auto-verified and promoted to administrator by the
    // bootstrap hook, so it can sign in immediately and continue to onboarding.
    const { error: signInError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (signInError) {
      // Everyone else must verify their email first.
      setSubmittedEmail(data.email)
      return
    }

    router.push("/dashboard")
    router.refresh()
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
              We sent a verification link to <strong>{submittedEmail}</strong>.
              Follow it to activate your account.
            </FieldDescription>
          </div>
          <Field>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/sign-in")}
            >
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
            <h1 className="text-xl font-bold">Welcome to Preskater</h1>
            <FieldDescription>
              Already have an account? <Link href="/sign-in">Sign in</Link>
            </FieldDescription>
          </div>

          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              autoComplete="name"
              placeholder="John Doe"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

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

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldDescription>At least 8 characters.</FieldDescription>
            <FieldError errors={[errors.password]} />
          </Field>

          <FieldError errors={serverError ? [{ message: serverError }] : []} />

          <Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create Account"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <Link href="/terms">Terms of Service</Link>{" "}
        and <Link href="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  )
}
