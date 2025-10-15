import { type Icon } from "@tabler/icons-react"
import { Link, useLocation } from "@tanstack/react-router"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Define category display names
const categoryNames: Record<string, string> = {
  communication: "Communication",
  analytics: "Analytics",
  system: "System"
};

export function NavSecondary({
  items,
  className,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    category: string
  }[]
  className?: string
}) {
  const location = useLocation();
  
  // Group items by category
  const categorizedItemsMap = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Convert to array to ensure consistent rendering
  const categorizedItems = Object.entries(categorizedItemsMap);

  return (
    <div className={className}>
      {categorizedItems.map(([category, categoryItems]) => (
        <SidebarGroup key={category}>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/80 font-medium">
            {categoryNames[category] || category}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {categoryItems.map((item) => (
                <SidebarMenuItem key={`${item.category}-${item.url}`}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="rounded-lg"
                  >
                    <Link to={item.url}>
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  )
}