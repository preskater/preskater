import {
  ShuffleIcon,
  TimerResetIcon,
  TrendingDownIcon,
  UnplugIcon,
} from "lucide-react"

const PAIN_POINTS = [
  {
    icon: UnplugIcon,
    text: "Vous avez trop d’outils qui ne se parlent pas entre eux",
  },
  {
    icon: ShuffleIcon,
    text: "Vous ne savez pas quoi garder, quoi remplacer, quoi ajouter",
  },
  {
    icon: TimerResetIcon,
    text: "Vos équipes perdent du temps à intégrer de nouvelles solutions toutes les 6 mois",
  },
  {
    icon: TrendingDownIcon,
    text: "Vous avez peur de faire le mauvais pari technologique et de devoir tout refaire dans 1 an",
  },
] as const

export function ProblemSection() {
  return (
    <section id="problem" className="py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Vous voulez vous moderniser, mais vous perdez un temps fou à choisir
          les bons outils
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PAIN_POINTS.map((pain) => (
            <div
              key={pain.text}
              className="flex items-start gap-4 rounded-xl bg-muted/50 p-5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-foreground/10">
                <pain.icon />
              </span>
              <p className="text-base text-pretty">{pain.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
