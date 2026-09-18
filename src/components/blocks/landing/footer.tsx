import Link from "next/link"
import { BoxesIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"

const FOOTER_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "Mentions légales", href: "/legal" },
] as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="flex max-w-sm flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BoxesIcon />
              </span>
              <span>Preskater</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Conseil IT pour moderniser votre stack sans complexité.
            </p>
          </div>
          <nav className="flex flex-wrap items-start gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground">
          © {year} Preskater. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
