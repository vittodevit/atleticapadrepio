import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {AppSidebar} from "@/components/app-sidebar"
import {Separator} from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type {Metadata} from "next";
import {SessionProvider} from "next-auth/react";
import {PageTitleProvider} from "@/components/page-title-context";
import PageTitle from "@/components/page-title";
import {ThemeProvider} from "@/components/theme-provider";
import {RenderProvider} from "@/components/render-context";

export const metadata: Metadata = {
  title: "Area Riservata Soci - Atletica Padre Pio",
  description: "Atletica Padre Pio – sito ufficiale San Giovanni Rotondo",
};

export default async function DashboardLayout({
                                                children,
                                              }: {
  children: React.ReactNode;
}) {
  const session = await auth()
  if (!session) {
    redirect('/login');
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
    >
      <RenderProvider>
        <SidebarProvider>
          <AppSidebar session={session}/>
          <SessionProvider>
            <PageTitleProvider>
              <SidebarInset>
                <header
                  className="flex w-full h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4 w-full">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <PageTitle/>
                  </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0" suppressHydrationWarning>
                  {children}
                </main>
              </SidebarInset>
            </PageTitleProvider>
          </SessionProvider>
        </SidebarProvider>
      </RenderProvider>
    </ThemeProvider>
  )
}
