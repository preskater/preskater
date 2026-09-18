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
    disableSignUp: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      console.log(`\n[reset-password] ${user.email}\n${url}\n`)
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "AGENT",
        input: false,
      },
      department: {
        type: "string",
        required: false,
        input: false,
      },
      jobTitle: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      managerId: {
        type: "string",
        required: false,
        input: false,
      },
      mustChangePassword: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
