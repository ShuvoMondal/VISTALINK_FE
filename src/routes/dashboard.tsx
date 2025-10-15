import { createFileRoute, Outlet, redirect, Link } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { isAuthenticated } from '@/api/services/authService'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    // Check if user is authenticated before accessing dashboard
    if (!isAuthenticated()) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-12 items-center gap-4 border-b px-4 lg:h-[--header-height] lg:px-6">
          <div className="text-xl font-bold">Vistalink Dashboard</div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/dashboard/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}