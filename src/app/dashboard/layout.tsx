import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { getCrmContext, isAdmin } from "@/lib/crm/context"

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const context = await getCrmContext()

  if (!context) {
    redirect("/sign-in")
  }

  if (context.user.mustChangePassword) {
    redirect("/change-password")
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          name: context.user.name,
          email: context.user.email,
          avatar: "",
          role: context.user.role,
        }}
        isAdmin={isAdmin(context)}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
