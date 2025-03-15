import React, {Suspense} from 'react';
import CarouselArticoli from "@/app/(website)/carousel-articoli";
import {PrismaClient} from "@prisma/client";
import {Skeleton} from "@/components/ui/skeleton";
import CarouselSponsor from "@/app/(website)/carousel-sponsor";
import Image from "next/image";
import {FileText, User} from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default function Home() {

  const articoli = prisma.articolo.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      titolo: true,
      slug: true,
      pubblicato: true,
      updatedAt: true,
      categorie: {
        select: {
          nome: true,
        },
      },
      immagineCopertina : {
        select: {
          id: true,
          altText: true,
        }
      },
      contenuto: true,
    },
    where: {
      pubblicato: true,
    }
  });

  const immaginiSponsor = prisma.immagine.findMany(
    {
      where: {
        includeInSponsor: true,
      }
    }
  )


  return (
    <section>
      <header className="container mx-auto flex justify-center p-4 items-center w-full pt-6 pb-2">
        <div
          className="bg-cover bg-center w-full h-64 md:h-96 flex p-4 flex-row md:justify-start justify-center"
          style={{backgroundImage: 'url(/api/images/67d58e63f099248550667d5a)'}}
        >
          <div className="bg-white p-4 shadow-md w-full md:w-96 flex flex-col items-center">
            <img
              src={"/api/images/67d58dd7f099248550667d51"}
              alt={"Logo decima corri san piol"}
              style={{ width: "65%" }}
              className={"mt-3"}
            />
            <div className="text-center w-100 mt-2">
              <h2 className="text-lg font-bold">
                Corri San Pio - 10&#7491; edizione</h2>
              <p>9.9km non competitiva</p>
              <Link
                href="/csp10.pdf"
                className={"px-3 py-2 bg-gray-600 text-white flex flex-row mt-4 " +
                  "items-center justify-items-center gap-2 rounded-md"}
              >
                <FileText size="20"/>
                Vai al modulo di iscrizione
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <CarouselArticoli articoliPromise={articoli} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <CarouselSponsor sponsorPromise={immaginiSponsor} showBadge={true} />
        </Suspense>
        <div
          className="p-4 shadow-md h-64 bg-center bg-cover grid grid-cols-1 grid-rows-[1fr_auto] gap-4"
          style={{backgroundImage: 'url(/api/images/67d589d3f099248550667cd3)'}}
        >
          <div></div>
          <div className="grid grid-rows-1 grid-cols-[auto_1fr] gap-4">
            <Link
              href="/sc3.pdf"
              className={"px-3 py-2 bg-gray-700 text-white flex flex-row " +
                "items-center justify-items-center gap-2 rounded-md"}
            >
              <FileText size="20"/>
              Vai al modulo di iscrizione
            </Link>
            <div></div>
          </div>
        </div>
      </section>
    </section>
)
  ;
}