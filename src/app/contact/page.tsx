import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon, CheckIcon } from "lucide-react"

import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact — Preskater",
  description:
    "Réservez un audit gratuit de votre stack : 30 min, sans engagement, avec des recommandations concrètes.",
}

const HIGHLIGHTS = [
  "30 min d’échange pour comprendre vos enjeux",
  "Sans engagement, aucun prérequis technique",
  "Recommandations concrètes à la fin de l’appel",
] as const

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Retour à l’accueil
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Parlons de votre stack
          </h1>
          <p className="max-w-md text-lg text-muted-foreground text-pretty">
            Décrivez votre contexte en quelques lignes. On revient vers vous
            pour planifier un audit gratuit de votre stack.
          </p>
          <ul className="flex flex-col gap-3">
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckIcon className="size-3" />
                </span>
                <span className="text-sm text-muted-foreground">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-background p-6 ring-1 ring-foreground/10 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
