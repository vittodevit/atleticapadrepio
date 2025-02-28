"use server"
import type { Metadata, ResolvingMetadata } from 'next'
import {Calendar, ChevronLeft} from "lucide-react";
import {PrismaClient} from '@prisma/client';
import {toNiceDateNoTime} from "@/lib/utils";
import {generateEllipsizedText} from "@/lib/utils";
import Link from "next/link";


const prisma = new PrismaClient();

export default async function ArticlePage(
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {

  const slug = (await params).slug;
  const article = await prisma.articolo.findUnique({
    where: {slug},
    include: {
      categorie: true,
      immagineCopertina: true,
    },
  });

  if (!article) {
    return (
      <>
        <div className="p-4 pl-0 pr-0 mx-4 md:mx-0">
          <h1 className="text-2xl font-bold">404 - Articolo non trovato</h1>
          <div className="p-5 bg-white shadow-md mt-4">
            <p className="mt-2">L&#39;articolo che stavi cercando non esiste!</p>
            <Link href="/articoli" className="mt-4 inline-block px-4 py-2 bg-app-1 text-white rounded-md">
              Torna alla lista degli articoli
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="p-4 pl-0 pr-0 mx-4 md:mx-0">
        <h1 className="text-2xl font-medium">{article.titolo}</h1>
        <div className="p-5 bg-white shadow-md mt-4">
          <div
            className="bg-cover bg-center w-full h-64 md:h-96 grid grid-rows-[1fr_auto] shadow-md"
            style={{backgroundImage: `url(/api/images/${article.immagineCopertina.id})`, backgroundSize: "110%"}}
          >
            <div></div>
            <div className="bg-opacity-70 shadow-md w-full">
              <div
                className="flex flex-row items-start gap-2"
                style={{background: "linear-gradient(to bottom, transparent, black)"}}
              >
                <div className="mt-20 p-4 gap-2 flex flex-row">
                  <div className="px-2 py-1 bg-gray-600 text-gray-200 rounded-md text-sm flex flex-row w-max">
                    <Calendar size={16} className="mr-1 mt-0.5"/>
                    {toNiceDateNoTime(new Date(article.updatedAt))}
                  </div>
                  {article.categorie.map((cat) => (
                    <span key={cat.nome}
                          className="px-2 py-1 text-sm bg-gray-300 text-gray-800 rounded-md mr-2">{cat.nome}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <hr className="my-4"/>
          <div className="text-justify">
            <div dangerouslySetInnerHTML={{__html: article.contenuto}}/>
          </div>
          <hr className="my-4"/>
          <div className="flex flex-row justify-end">
            <Link href="/articoli" className="px-3 py-2 bg-app-1 text-white gap-2 rounded-md flex flex-row">
              <ChevronLeft/>
              Torna indietro
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

interface Props {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const article = await prisma.articolo.findUnique({
    where: { slug },
    include: {
      categorie: true,
      immagineCopertina: true,
    },
  });

  if (!article) {
    return {
      title: 'Articolo non trovato',
      description: 'L\'articolo richiesto non è stato trovato',
    };
  }

  return {
    title: article.titolo,
    description: generateEllipsizedText(article.contenuto, 160),
    keywords: article.tags.map((cat) => cat).join(', '),
    openGraph: {
      title: article.titolo,
      description: generateEllipsizedText(article.contenuto, 160),
      images: [
        {
          url: `/api/images/${article.immagineCopertina.id}`,
          alt: article.immagineCopertina.altText,
        },
      ],
      url: `https://atleticapadrepio.it/articoli/${slug}`,
      type: 'article',
    },
  };
}