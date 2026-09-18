import { randomUUID } from "node:crypto"

import { PrismaPg } from "@prisma/adapter-pg"
import { hashPassword } from "better-auth/crypto"

import { PrismaClient } from "../src/generated/prisma/client"

const ADMIN_EMAIL = "administrator@preskater.com"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const password = process.env.ADMINISTRATOR_PASSWORD

  if (!password) {
    console.error(
      "[seed] ADMINISTRATOR_PASSWORD is not set. Add it to your .env before seeding."
    )
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    select: { id: true },
  })

  if (existing) {
    console.log(`[seed] ${ADMIN_EMAIL} already exists, skipped`)
    return
  }

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: "Administrateur",
      email: ADMIN_EMAIL,
      emailVerified: true,
      role: "ADMIN",
      department: "OPERATIONS",
      jobTitle: "Administrateur",
      mustChangePassword: false,
    },
    select: { id: true },
  })

  await prisma.account.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: await hashPassword(password),
    },
  })

  console.log(`[seed] created ${ADMIN_EMAIL} (ADMIN)`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
