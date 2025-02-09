"use client"
import {useState} from "react";
import Image from "next/image";
import logo from "@/app/icon.png";
import Link from "next/link";
import {Menu, User} from "lucide-react";

export default function Home() {
  const [menuHidden, setMenuHidden] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-neutral-600 text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
            <Link href={"/"} className="flex flex-row justify-items-center items-center">
              <Image src={logo} alt="Atletica Padre Pio" width={35} height={35} />
              <h1 className="text-xl font-bold ml-3">
                Atletica Padre Pio
              </h1>
            </Link>
          <div className="flex flex-row items-center justify-items-center">
            <button
              className="md:hidden px-3 py-2 bg-app-1 rounded-md text-white mr-2"
              onClick={() => setMenuHidden(!menuHidden)}
            >
              <Menu size="20" />
            </button>
            <ul className="hidden md:flex space-x-4 mr-4">
              <li><a href="#" className="hover:underline">Articoli</a></li>
              <li><a href="#" className="hover:underline">Associazione</a></li>
              <li><a href="#" className="hover:underline">Link Utili</a></li>
              <li><a href="#" className="hover:underline">Contatti</a></li>
            </ul>
            <Link
              href="/dashboard"
              className="px-3 py-2 bg-app-1 text-white flex flex-row items-center justify-items-center gap-2 rounded-md"
            >
              <User size="20" />
              <span className="hidden md:block">
                Area Soci
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-gray-50">
        <header className="container mx-auto flex justify-center p-4 items-center w-full pt-6 pb-2">
          <div
            className="bg-cover bg-center w-full h-64 md:h-96 flex p-4 flex-row md:justify-start justify-center"
            style={{backgroundImage: 'url(https://staticgeopop.akamaized.net/wp-content/uploads/sites/32/2023/05/biomeccanica-100-metri.jpg)'}}
          >
            <div className="bg-gray-700 bg-opacity-70 p-4 shadow-md w-full md:w-96">
              <h2 className="text-lg font-bold text-white">Evento</h2>
              <p className="text-white">Evento in evidenza</p>
            </div>
          </div>
        </header>


        <section className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow-md">
            <h2 className="text-lg font-bold">Zona Articoli</h2>
            <p className="text-gray-600">Fai finta ci sia un immagine.</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white">Vedi altri</button>
          </div>
          <div className="bg-white p-4 shadow-md">
            <h2 className="text-lg font-bold">Zona sponsor</h2>
            <p className="text-gray-600">Fai finta ci sia una carrellata di immagini</p>
          </div>
          <div className="bg-white p-4 shadow-md">
            <h2 className="text-lg font-bold">Iscriviti</h2>
            <p className="text-gray-600">Zona di iscrizione all&#39;associazione</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white">Tasto che porta al form</button>
          </div>
        </section>
      </main>

      <footer className="bg-white text-center p-4 shadow-inner">
        <p className="text-gray-500">© 2025 BlogName. All rights reserved.</p>
      </footer>
    </div>
  );
}
