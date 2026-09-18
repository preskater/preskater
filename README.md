# Preskater CRM

A multi-tenant CRM built with Next.js (App Router), Prisma, and Better Auth.

## Getting Started

```bash
npm install
cp .env.example .env       # fill in the values
npm run db:up              # start PostgreSQL (Docker, host port 5433)
npm run db:migrate         # apply migrations
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Bootstrap the first administrator

There is no seed script. The **first account** created on a fresh database is
automatically promoted to `ADMIN` and marked email-verified, so it can sign in
immediately, create the first organization during onboarding, and invite others.

1. Sign up at `/sign-up`. The first user is redirected to `/onboarding`.
2. Create the first organization. Only administrators may create organizations.
3. Invite teammates from `/dashboard/settings/organization`.

### Verification and invitations

Email delivery is not wired up. Better Auth logs the relevant URLs to the server
console instead, so an operator can relay them:

```bash
docker compose logs -f app
# [verify-email] user@example.com
# http://localhost:3000/api/auth/verify-email?token=...&callbackURL=...
# [invitation] user@example.com → Acme
# http://localhost:3000/invitations/<id>
```

Every account after the first must verify its email before signing in. Invited
users sign up, verify via the logged link, then open `/invitations/<id>` to join
the organization.

## Docker

```bash
cp .env.prod.example .env.prod
docker compose up --build -d
```

The `migrate` service runs `prisma migrate deploy` before the app starts. It
never seeds data, so redeploying does not touch existing rows.
