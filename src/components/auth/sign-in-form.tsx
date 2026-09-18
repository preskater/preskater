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
import { signInSchema, type SignInFormData } from "@/lib/schemas/auth"

export function SignInForm({
  className,
  callbackUrl = "/dashboard",
  ...props
}: React.ComponentProps<"div"> & { callbackUrl?: string }) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [emailNotVerified, setEmailNotVerified] = useState(false)
  const [resent, setResent] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  })

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    setServerError(null)
    setEmailNotVerified(false)
    setResent(false)

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (error) {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        setEmailNotVerified(true)
        setServerError(
          "Votre email n'est pas encore vérifié. Consultez votre boîte de réception."
        )
        return
      }

      setServerError(
        error.status === 401
          ? "Email ou mot de passe incorrect."
          : "Connexion impossible. Merci de réessayer."
      )
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  async function handleResend() {
    const email = getValues("email")
    if (!email) return

    setResent(false)
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: callbackUrl,
    })

    if (!error) {
      setResent(true)
    }
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
              Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
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

          <Field data-invalid={!!errors.password}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-sm underline underline-offset-4 hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <FieldError errors={serverError ? [{ message: serverError }] : []} />

          {emailNotVerified && (
            <Field>
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={resent}
              >
                {resent ? "Verification email sent" : "Resend verification email"}
              </Button>
            </Field>
          )}

          <Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign In"}
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
