"use client"

import * as React from "react"
import {
  Newspaper,
  House,
  FileText,
  Users,
  Tag,
  ImageUp
} from "lucide-react"

import { NavSection } from "@/components/nav-section"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {Session} from "next-auth";
import Link from "next/link";
import ConditionalHider from "@/components/conditional-hider";
import {TipoSocio} from "@prisma/client";
import {useState} from "react";
import {ImageUploadDialog} from "@/app/dashboard/immagini/image-upload-dialog";

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session
}

export function AppSidebar({ ...props }: SidebarProps) {

  // GESTIONE STATI DIALOGS
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const openImageDialog = () => setIsImageDialogOpen(true);

  const role = props.session.user.role.replace("_", " ").toLowerCase();
  const data = {
    navAdmin: [
      {
        name: "Articoli",
        url: "/dashboard/articoli",
        icon: Newspaper,
      },
      {
        name: "Categorie",
        url: "/dashboard/categorie",
        icon: Tag,
        hideAddButton: true,
      },
      {
        name: "Immagini",
        url: "/dashboard/immagini",
        icon: ImageUp,
        onClickNew: openImageDialog
      },
      {
        name: "Anagrafiche",
        url: "/dashboard/anagrafica",
        icon: Users,
      },
    ],
    navSoci: [
      {
        name: "Documenti",
        url: "/dashboard/documenti",
        icon: FileText,
        hideAddButton: true,
      },
    ],
  }

  return (
    <section>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <House className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Area Riservata Soci</span>
                    <span className="text-neutral-500">Ruolo:{" "}
                      <span className="font-semibold">
                      {role}
                    </span>
                  </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavSection menuItems={data.navSoci} title="Risorse Soci" />
          <ConditionalHider hidden={props.session.user.role !== TipoSocio.ADMIN}>
            <NavSection menuItems={data.navAdmin} title="Risorse Admin" />
          </ConditionalHider>
        </SidebarContent>
        <SidebarFooter>
          <NavUser session={props.session} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <ImageUploadDialog
        isDialogOpen={isImageDialogOpen}
        setIsDialogOpen={setIsImageDialogOpen}
        key={isImageDialogOpen ? 'imageDialog_open' : 'imageDialog_closed'}
      />
    </section>
  )
}
