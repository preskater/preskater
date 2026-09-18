import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground md:px-14 md:py-20">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Prêt à y voir clair dans votre stack ?
          </h2>
          <p className="max-w-xl text-lg text-primary-foreground/80 text-pretty">
            On vous aide à choisir les bons outils et à les déployer sans casser
            votre activité.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              variant="secondary"
              size="lg"
              className="h-11 px-6"
            >
              Réserver un audit gratuit de votre stack
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <p className="text-sm text-primary-foreground/80">
              30 min • Sans engagement • Recommandations concrètes à la fin
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
