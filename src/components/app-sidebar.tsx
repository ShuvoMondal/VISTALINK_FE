import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconUserShield,
  IconListDetails,
  IconPlug,
  IconFileCertificate,
  IconActivity,
  IconMail,
  IconSettings,
  IconReport,
  IconHelp,
  IconSearch,
  IconCircleCheck,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // Overview
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      category: "overview"
    },
    // User Management
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUserShield,
      category: "management"
    },
    {
      title: "Roles",
      url: "/dashboard/roles",
      icon: IconUserShield,
      category: "management"
    },
    {
      title: "Departments",
      url: "/dashboard/departments",
      icon: IconListDetails,
      category: "management"
    },
    // System Configuration
    {
      title: "Serial Ports",
      url: "/dashboard/serial-ports",
      icon: IconPlug,
      category: "configuration"
    },
    // Data Management
    {
      title: "Data Management",
      url: "/dashboard/serial-data",
      icon: IconDatabase,
      category: "data"
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: IconFileCertificate,
      category: "data"
    },

    // Monitoring
    {
      title: "Activity Logs",
      url: "/dashboard/activity-logs",
      icon: IconActivity,
      category: "monitoring"
    },
  ],
  navSecondary: [
    // Analytics

    // System
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
      category: "system"
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Vistalink</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
