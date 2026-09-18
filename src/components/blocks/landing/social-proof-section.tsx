import { QuoteIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CLIENT_LOGOS = ["Nexa", "Lumo", "Atlas", "Orbit", "Vertex"] as const

const CASE_STUDIES = [
  {
    client: "Éditeur SaaS B2B",
    result: "−40 % de coûts cloud en 3 mois",
    description:
      "Audit complet de l’infrastructure, right-sizing et migration vers une architecture plus sobre.",
  },
  {
    client: "PME industrielle",
    result: "−60 % de temps d’intégration",
    description:
      "Unification des flux entre l’ERP, le CRM et les outils internes via des APIs et de l’automation.",
  },
  {
    client: "Scale-up e-commerce",
    result: "×2 sur la vitesse de déploiement",
    description:
      "Conteneurisation et mise en place d’une CI/CD adaptée à une équipe en forte croissance.",
  },
] as const

const TESTIMONIALS = [
  {
    quote:
      "En deux semaines, on savait exactement quoi garder et quoi supprimer. On a arrêté de payer pour des outils inutilisés.",
    name: "Claire Martin",
    role: "CTO",
    company: "Nexa",
    initials: "CM",
  },
  {
    quote:
      "L’équipe a mis en place une stack claire et a formé nos devs. On déploie maintenant en quelques minutes.",
    name: "Thomas Bernard",
    role: "Head of Engineering",
    company: "Lumo",
    initials: "TB",
  },
  {
    quote:
      "Enfin une roadmap technologique qu’on comprend et qu’on peut présenter au comité de direction.",
    name: "Sofia Ricci",
    role: "COO",
    company: "Atlas Industries",
    initials: "SR",
  },
] as const

export function SocialProofSection() {
  return (
    <section
      id="testimonials"
      className="border-y bg-muted/30 py-16 md:py-20"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ils nous font confiance pour simplifier leur stack
          </h2>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {CLIENT_LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-lg font-semibold tracking-tight text-muted-foreground/60"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <Card key={study.client}>
              <CardHeader>
                <Badge variant="secondary" className="mb-2 w-fit">
                  {study.result}
                </Badge>
                <CardTitle>{study.client}</CardTitle>
                <CardDescription>{study.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="flex h-full flex-col gap-6">
                <QuoteIcon className="size-6 text-muted-foreground/40" />
                <blockquote className="flex-1 text-base text-pretty">
                  “{testimonial.quote}”
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
