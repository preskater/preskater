import type { Metadata } from "next"

import { Navbar } from "@/components/blocks/landing/navbar"
import { HeroSection } from "@/components/blocks/landing/hero-section"
import { ProblemSection } from "@/components/blocks/landing/problem-section"
import { SolutionSection } from "@/components/blocks/landing/solution-section"
import { ProcessSection } from "@/components/blocks/landing/process-section"
import { SocialProofSection } from "@/components/blocks/landing/social-proof-section"
import { FaqSection } from "@/components/blocks/landing/faq-section"
import { CtaSection } from "@/components/blocks/landing/cta-section"
import { Footer } from "@/components/blocks/landing/footer"

export const metadata: Metadata = {
  title: "Preskater — Modernisez votre informatique sans complexité",
  description:
    "On aide les entreprises à choisir et déployer la bonne stack (cloud, SaaS, automation, data) pour gagner en productivité et réduire la complexité.",
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ProcessSection />
        <SocialProofSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
