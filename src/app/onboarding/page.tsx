import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCrmContext } from "@/lib/crm/context"

import { OnboardingForm } from "./onboarding-form"
import { PendingInvitations } from "./pending-invitations"

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in?callbackUrl=/onboarding")
  }

  const context = await getCrmContext()

  if (context) {
    redirect("/dashboard")
  }

  const isAdmin = session.user.role === "ADMIN"

  if (!isAdmin) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
        <PendingInvitations
          emailVerified={session.user.emailVerified}
          email={session.user.email}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <OnboardingForm />
    </div>
  )
}
