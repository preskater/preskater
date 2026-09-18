import { SignInForm } from "@/components/auth/sign-in-form"

export default async function LoginPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const params = await searchParams
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : "/dashboard"

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm callbackUrl={callbackUrl} />
      </div>
    </div>
  )
}
