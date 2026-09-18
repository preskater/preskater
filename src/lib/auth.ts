import { betterAuth } from "better-auth"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { nextCookies } from "better-auth/next-js"

import { prisma } from "@/lib/prisma"

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [appUrl],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`\n[reset-password] ${user.email}\n${url}\n`)
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`\n[verify-email] ${user.email}\n${url}\n`)
      }
    },
  },
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
