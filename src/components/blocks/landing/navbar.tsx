import Link from "next/link"
import { BoxesIcon, MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV_LINKS = [
  { label: "Solution", href: "#solution" },
  { label: "Méthode", href: "#process" },
  { label: "Références", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
] as const

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BoxesIcon />
          </span>
          <span>Preskater</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button render={<Link href="/contact" />} nativeButton={false}>
            Réserver un audit
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <MenuIcon />
            <span className="sr-only">Ouvrir le menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-4/5 gap-0">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BoxesIcon />
                </span>
                Preskater
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigation principale
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  render={<Link href={link.href} />}
                  nativeButton={false}
                  className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted"
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto p-4">
              <Button
                render={<Link href="/contact" />}
                nativeButton={false}
                className="w-full"
              >
                Réserver un audit
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
