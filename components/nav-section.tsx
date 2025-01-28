"use client"

import {
  type LucideIcon, CirclePlus,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import {useRouter} from "next/navigation";

export function NavSection({
  menuItems,
}: {
  menuItems: {
    name: string
    url: string
    icon: LucideIcon
    onClickNew? : () => void
  }[]
}) {

  const router = useRouter();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Strumenti Admin</SidebarGroupLabel>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuAction showOnHover onClick={() => {
              if (item.onClickNew) {
                item.onClickNew();
                return;
              }
              router.push(item.url + "/new");
            }}>
              <CirclePlus />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
