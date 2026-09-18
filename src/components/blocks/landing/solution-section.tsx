import { LineChartIcon, RocketIcon, RouteIcon, SearchCheckIcon } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SOLUTION_BLOCKS = [
  {
    icon: SearchCheckIcon,
    title: "Audit & cartographie",
    description: "Analyse de votre infrastructure et de vos outils actuels",
  },
  {
    icon: RouteIcon,
    title: "Recommandations sur mesure",
    description: "Quoi garder, quoi changer, dans quel ordre",
  },
  {
    icon: RocketIcon,
    title: "Déploiement accompagné",
    description: "Mise en place, intégration, formation de vos équipes",
  },
  {
    icon: LineChartIcon,
    title: "Suivi & adoption",
    description:
      "On s’assure que les nouveaux outils sont bien adoptés et utiles",
  },
] as const

export function SolutionSection() {
  return (
    <section id="solution" className="border-y bg-muted/30 py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          On met de la clarté dans votre stack et on vous donne un plan de
          modernisation concret
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTION_BLOCKS.map((block) => (
            <Card key={block.title}>
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <block.icon />
                </span>
                <CardTitle>{block.title}</CardTitle>
                <CardDescription>{block.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
