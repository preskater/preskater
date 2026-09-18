import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const STEPS = [
  {
    title: "Appel de découverte",
    description: "on comprend vos objectifs, contraintes et douleurs",
  },
  {
    title: "Audit & cartographie",
    description: "on analyse votre stack, vos flux et vos coûts",
  },
  {
    title: "Recommandations & roadmap",
    description: "on vous livre un plan clair, priorisé et chiffré",
  },
  {
    title: "Déploiement & suivi",
    description: "on met en place les outils et on accompagne vos équipes",
  },
] as const

export function ProcessSection() {
  return (
    <section id="process" className="py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Une méthode simple en 4 étapes
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full">
                <CardHeader>
                  <span className="mb-2 flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
