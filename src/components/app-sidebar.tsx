"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  OrganizationSwitcher,
  type OrganizationSummary,
} from "@/components/crm/organization-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  ActivityIcon,
  BuildingIcon,
  ChartBarIcon,
  CircleHelpIcon,
  CommandIcon,
  ContactIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SearchIcon,
  Settings2Icon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  TargetIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react"

export function AppSidebar({
  user,
  organizations,
  activeOrganizationId,
  canCreateOrganization,
  isAdmin,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    email: string
    avatar: string
    role: string
  }
  organizations: OrganizationSummary[]
  activeOrganizationId: string
  canCreateOrganization: boolean
  isAdmin: boolean
}) {
  const navMain = [
    { title: "Tableau de bord", url: "/dashboard", icon: <LayoutDashboardIcon /> },
    { title: "Comptes", url: "/dashboard/accounts", icon: <BuildingIcon /> },
    { title: "Contacts", url: "/dashboard/contacts", icon: <ContactIcon /> },
    { title: "Prospects", url: "/dashboard/leads", icon: <TargetIcon /> },
    {
      title: "Opportunités",
      url: "/dashboard/opportunities",
      icon: <ChartBarIcon />,
    },
    { title: "Commandes", url: "/dashboard/orders", icon: <ShoppingCartIcon /> },
  ]

  const navCatalog = [
    { title: "Produits", url: "/dashboard/products", icon: <PackageIcon /> },
    { title: "Services", url: "/dashboard/services", icon: <WrenchIcon /> },
    {
      title: "Activités",
      url: "/dashboard/activities",
      icon: <ActivityIcon />,
    },
  ]

  const navAdmin = [
    { title: "Employés", url: "/dashboard/employees", icon: <UsersIcon /> },
    {
      title: "Organisation",
      url: "/dashboard/settings/organization",
      icon: <SlidersHorizontalIcon />,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/dashboard" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Preskater CRM</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <OrganizationSwitcher
          organizations={organizations}
          activeId={activeOrganizationId}
          canCreate={canCreateOrganization}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Pilotage" items={navMain} />
        <NavMain title="Catalogue" items={navCatalog} />
        <NavDocuments
          title="Administration"
          items={isAdmin ? navAdmin : []}
        />
        <NavSecondary
          items={[
            {
              title: "Aide",
              url: "/dashboard",
              icon: <CircleHelpIcon />,
            },
            {
              title: "Recherche",
              url: "/dashboard",
              icon: <SearchIcon />,
            },
            {
              title: "Paramètres",
              url: "/dashboard/settings/organization",
              icon: <Settings2Icon />,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
