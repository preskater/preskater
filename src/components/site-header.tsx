"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const titles: { prefix: string; title: string }[] = [
  { prefix: "/dashboard/settings/organization", title: "Organisation" },
  { prefix: "/dashboard/accounts", title: "Comptes" },
  { prefix: "/dashboard/contacts", title: "Contacts" },
  { prefix: "/dashboard/leads", title: "Prospects" },
  { prefix: "/dashboard/opportunities", title: "Opportunités" },
  { prefix: "/dashboard/products", title: "Produits" },
  { prefix: "/dashboard/services", title: "Services" },
  { prefix: "/dashboard/orders", title: "Commandes" },
  { prefix: "/dashboard/employees", title: "Employés" },
  { prefix: "/dashboard/activities", title: "Activités" },
  { prefix: "/dashboard", title: "Tableau de bord" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const title =
    titles.find((entry) => pathname.startsWith(entry.prefix))?.title ?? "CRM"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
