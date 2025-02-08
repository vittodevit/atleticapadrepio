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
              className="md:hidden px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white mr-2"
              onClick={() => setMenuHidden(!menuHidden)}
            >
              <Menu size="20" />
            </button>
            <ul className="hidden md:flex space-x-4 mr-4">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Gallery</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
            <Link
              href="/dashboard"
              className="px-3 py-2 bg-blue-500 text-white flex flex-row items-center justify-items-center gap-2 rounded-md hover:bg-blue-600"
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
              <h2 className="text-lg font-bold text-white">Calendar</h2>
              <p className="text-white">Upcoming events and races.</p>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white">Read More</button>
            </div>
          </div>
        </header>


        <section className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow-md">
            <h2 className="text-lg font-bold">Calendar</h2>
            <p className="text-gray-600">Upcoming events and races.</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white">Read More</button>
          </div>
          <div className="bg-white p-4 shadow-md">
            <h2 className="text-lg font-bold">Membership</h2>
            <p className="text-gray-600">Join our running club today.</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white">Read More</button>
          </div>
          <div className="bg-white p-4 shadow-md">
            <h2 className="text-lg font-bold">Results</h2>
            <p className="text-gray-600">Latest race results and leaderboards.</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white">Read More</button>
          </div>
        </section>
      </main>

      <footer className="bg-white text-center p-4 shadow-inner">
        <p className="text-gray-500">© 2025 BlogName. All rights reserved.</p>
      </footer>
    </div>
  );
}
