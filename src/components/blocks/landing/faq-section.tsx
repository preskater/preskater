import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    question: "Combien coûte un audit ?",
    answer:
      "L’audit initial est offert pour les projets qualifiés. Pour les missions plus larges, on vous propose un devis sur mesure après l’appel de découverte.",
  },
  {
    question: "Combien de temps ça prend ?",
    answer:
      "Comptez 1 à 2 semaines pour l’audit et les recommandations. Le déploiement dépend du périmètre (de quelques jours à plusieurs semaines).",
  },
  {
    question: "Avec quelles technos travaillez-vous ?",
    answer:
      "Cloud (AWS, GCP), conteneurs & orchestration (Docker, Kubernetes), web (Next.js, React, Node), data & automation (Supabase, outils no-code/low-code, APIs).",
  },
  {
    question: "Intervenez-vous uniquement en France ?",
    answer:
      "Nous travaillons principalement avec des entreprises en Europe, en remote ou en hybride (quelques jours sur site si nécessaire).",
  },
] as const

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Questions fréquentes
        </h2>
        <Accordion>
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index + 1}`}>
              <AccordionTrigger className="py-4 text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
