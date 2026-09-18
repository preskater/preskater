import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

import { ChangePasswordForm } from "./change-password-form"

export default async function ChangePasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in?callbackUrl=/change-password")
  }

  if (!session.user.mustChangePassword) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ChangePasswordForm />
      </div>
    </div>
  )
}
