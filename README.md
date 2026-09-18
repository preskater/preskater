# Preskater CRM

A single-tenant CRM for internal use, built with Next.js (App Router), Prisma, and Better Auth.

There is no public sign-up: accounts are provisioned with a seed script. Everyone
shares the same CRM workspace.

## Getting Started

```bash
npm install
cp .env.example .env       # fill in the values
npm run db:up              # start PostgreSQL (Docker, host port 5433)
npm run db:migrate         # apply migrations
npm run db:seed            # create the administrator account
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Accounts and first sign-in

The seed creates a single administrator account,
`administrator@preskater.com`, using the password from the
`ADMINISTRATOR_PASSWORD` environment variable. Set it in `.env` (and
`.env.prod` for Docker) before running:

```bash
npm run db:seed
```

The seed fails if `ADMINISTRATOR_PASSWORD` is unset. The administrator is
created verified and is **not** forced to change the password on first sign-in,
so pick a strong value.

- Administrators (`role: "ADMIN"`) can manage employees under
  `/dashboard/employees`.
- The seed is idempotent: re-running it skips the account if it already exists,
  so it is safe after deploys.

### Forgotten passwords

There is no mail provider configured. Better Auth logs reset URLs to the server
console so an operator can relay them:

```bash
docker compose logs -f app
# [reset-password] user@example.com
# http://localhost:3000/api/auth/reset-password?token=...
```

Users request a reset from `/forgot-password`; you pass them the logged link.

## Docker

```bash
cp .env.prod.example .env.prod
docker compose up --build -d
```

The `migrate` service runs `prisma migrate deploy` and then `prisma db seed`
before the app starts, so a fresh volume is provisioned automatically. The seed
is idempotent, so redeploys leave existing accounts untouched.

For local (non-Docker) development, run `npm run db:seed` once after
`npm run db:migrate`.
