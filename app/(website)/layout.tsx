import Link from "next/link";
import Image from "next/image";
import React from "react";
import logo from "@/app/icon.png";
import AppNavigation from "@/components/app-navigation";

export default async function WebsiteLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <section>

      <div className="min-h-screen grid grid-cols-1 grid-rows-[auto_1fr_auto]">
        <nav className="text-black p-4 sticky top-0 z-10 border-b border-gray-300 bg-white shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <Link href={"/"} className="flex flex-row justify-items-center items-center">
              <Image src={logo} alt="Atletica Padre Pio" width={35} height={35}/>
              <h1 className="text-xl font-bold ml-3">
                Atletica Padre Pio
              </h1>
            </Link>
            <AppNavigation/>
          </div>
        </nav>

        <div className="bg-gray-100">
          <main className="flex-grow pt-2 mb-6">
            {children}
          </main>
        </div>

        <footer className="bg-white text-center p-4 border-t border-gray-300 shadow-sm">
          <p className="text-gray-500">
            © 2025 Atletica Padre Pio. Seugici anche su
            <a href="https://www.facebook.com/atletica.padrepio" className="text-blue-500 "> Facebook!</a><br/>
            Sito realizzato da <a href="https://vitto.dev" className="text-blue-500">Vittorio Lo Mele</a>
          </p>
        </footer>
      </div>
    </section>
  )
    ;
}
