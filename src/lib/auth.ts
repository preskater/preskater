import { betterAuth } from "better-auth"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { nextCookies } from "better-auth/next-js"
import { organization } from "better-auth/plugins"

import { prisma } from "@/lib/prisma"

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

// Arbitrary but fixed key so concurrent first sign-ups serialize on the same
// Postgres advisory lock. The lock is transaction-scoped and auto-releases.
const BOOTSTRAP_LOCK_KEY = 982451653

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
      console.log(`\n[reset-password] ${user.email}\n${url}\n`)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // No mail provider is configured: log the link so an operator can relay
      // it. The first account is auto-verified by the bootstrap hook and can
      // safely ignore this link.
      console.log(`\n[verify-email] ${user.email}\n${url}\n`)
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // The very first account on a fresh deployment becomes the
          // administrator and is auto-verified so it can sign in and create the
          // first organization. The transaction-scoped advisory lock serializes
          // concurrent sign-ups, so exactly one account observes zero admins and
          // is promoted; the others become regular agents.
          try {
            await prisma.$transaction(async (tx) => {
              await tx.$executeRaw`SELECT pg_advisory_xact_lock(${BOOTSTRAP_LOCK_KEY})`
              const adminCount = await tx.user.count({
                where: { role: "ADMIN" },
              })
              if (adminCount === 0) {
                await tx.user.update({
                  where: { id: user.id },
                  data: { role: "ADMIN", emailVerified: true },
                })
              }
            })
          } catch (error) {
            console.error("[bootstrap] first-user promotion failed", error)
          }
        },
      },
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
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: async (user) => user.role === "ADMIN",
      organizationLimit: 100,
      membershipLimit: 100,
      creatorRole: "owner",
      invitationExpiresIn: 60 * 60 * 24 * 7,
      sendInvitationEmail: async ({ email, organization: org, invitation }) => {
        console.log(
          `\n[invitation] ${email} → ${org.name}\n${appUrl}/invitations/${invitation.id}\n`
        )
      },
    }),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
