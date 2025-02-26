"use client"
import {Menu, User} from "lucide-react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "./ui/sheet";
import Link from "next/link";
import { NavigationMenu, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import React, {useState} from "react";
import Image from "next/image";
import logofull from "@/app/logofull.png";

function AppNavigation() {

  const [menuHidden, setMenuHidden] = useState(true)

  return (
    <div className="flex flex-row items-center justify-items-center">
      <Sheet>
        <SheetTrigger className="md:hidden px-3 py-2 bg-app-1 rounded-md text-white mr-2">
          <Menu size="20"/>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Pagine del sito</SheetTitle>
            <SheetDescription>
              <Link href="/articoli" className="block p-2 text-base underline">
                Articoli
              </Link>
              <Link href="/statuto" className="block p-2 text-base underline">
                Statuto
              </Link>
              <Link href="/gerarchia" className="block p-2 text-base underline">
                Gerarchia
              </Link>
              <Link href="/link-utili" className="block p-2 text-base underline">
                Link Utili e Contatti
              </Link>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <NavigationMenu className={cn("mr-3 md:flex", menuHidden && "hidden")}>
        <NavigationMenuList>

          <NavigationMenuItem style={{display: "inline-block"}}>
            <NavigationMenuTrigger>Associazione</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-white mt-11 border-1 border-gray-300 rounded-md shadow-md">
                <li className="row-span-4">
                  <NavigationMenuLink asChild>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className={"max-w-[160px] mx-auto mb-4"}>
                        <Image src={logofull} alt="Atletica Padre Pio" className={"rounded-full"}/>
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        L’Associazione Sportiva Dilettantistica “Atletica Padre Pio” ha lo scopo di diffondere
                        la pratica
                        amatoriale dell’Atletica Leggera nella nostra Città.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItems/>
              </ul>

            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem style={{display: "inline-block"}}>
            <Link href="/articoli" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Articoli
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>

      <Link
        href="/dashboard"
        className={"px-3 py-2 bg-app-1 text-white flex flex-row " +
          "items-center justify-items-center gap-2 rounded-md " + (menuHidden ? "" : "ml-3")}
      >
        <User size="20"/>
        <span className="hidden md:block">
                Area Soci
              </span>
      </Link>
    </div>
  )
    ;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({className, title, children, ...props}, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = "ListItem"

const ListItems = () => {
  return (
    <>
      <ListItem href="/storia" title="La storia">
        Come nasce l&#39;associazione Atletica Padre Pio?
      </ListItem>
      <ListItem href="/statuto" title="Statuto">
        Statuto dell&#39;associazione e le regole che la governano
      </ListItem>
      <ListItem href="/gerarchia" title="Gerarchia">
        Direttivo, collaboratori e Responsabile Safeguarding
      </ListItem>
      <ListItem href="/link-utili" title="Link Utili e Contatti">
        Contatti e link utili per contattare l&#39;associazione
      </ListItem>
    </>
  );
}

export default AppNavigation;