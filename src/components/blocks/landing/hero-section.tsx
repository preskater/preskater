import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const CLIENT_LOGOS = ["Nexa", "Lumo", "Atlas", "Orbit", "Vertex"] as const

const EXPERTISES = [
  "AWS / GCP",
  "Kubernetes",
  "Next.js",
  "Supabase",
  "Automation",
  "Data",
] as const

export function HeroSection() {
  return (
    <section id="hero" className="border-b bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-20 pb-16 sm:px-6 md:pt-28 md:pb-24 lg:px-8">
        <div className="flex max-w-3xl flex-col gap-6">
          <Badge variant="secondary" className="w-fit">
            Conseil IT • Cloud • Automation • Data
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Modernisez votre informatique sans vous perdre dans la jungle des
            outils
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
            On aide les entreprises à choisir et déployer la bonne stack (cloud,
            SaaS, automation, data) pour gagner en productivité et réduire la
            complexité.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              size="lg"
              className="h-11 w-fit px-6"
            >
              Réserver un audit gratuit de votre stack
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <p className="text-sm text-muted-foreground">
              30 min • Sans engagement • Recommandations concrètes à la fin
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="text-sm font-medium text-muted-foreground">
              Déjà accompagné :
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {CLIENT_LOGOS.map((logo) => (
                <span
                  key={logo}
                  className="text-base font-semibold tracking-tight text-muted-foreground/70"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Expertises :
            </span>
            {EXPERTISES.map((expertise) => (
              <Badge key={expertise} variant="outline">
                {expertise}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
