"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchArticles } from '@/actions/fetch-articles';
import {Calendar} from "lucide-react";
import {Skeleton} from '@/components/ui/skeleton';
import {generateEllipsizedText} from "@/lib/ellipsize";

export default function ArticoliPage() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const fetchAndSetArticles = async () => {
      if (loading) return; // Prevent duplicate fetches
      setLoading(true);
      const data = await fetchArticles(page, 10);
      if (data.length === 0) setHasMore(false); // No more articles to load
      if (firstLoad) {
        setArticles(data);
      }
      else{
        setArticles((prevArticles) => [...prevArticles, ...data]);
      }
      setLoading(false);
    };

    fetchAndSetArticles();
  }, [page]);

  const loadMore = () => {
    setFirstLoad(false);
    if (hasMore) setPage((prevPage) => prevPage + 1);
  };

  const randKey = (id: string) => {
    return id + Math.random().toString(36).substr(2, 9);
  }

  return (
    <div className="p-4 pl-0 pr-0 mx-4 md:mx-0">
      <h1 className="text-2xl font-medium">Articoli del sito</h1>
      <ul className={`grid grid-cols-1 gap-4 mt-4 mb-3`}>
        {articles.map((article) => (
          <li key={randKey(article.id)} className="p-4 bg-white shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
              <div className="relative w-full md:w-40 h-40 rounded-lg">
                <Image
                  className="rounded-lg"
                  key={randKey(article.immagineCopertina.id)}
                  src={`/api/images/${article.immagineCopertina.id}`}
                  alt={article.immagineCopertina.altText}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div>
                <Link href={`/articoli/${article.slug}`}>
                  <h2 className="bold text-lg font-medium text-justify mb-1">{article.titolo}</h2>
                </Link>
                <div className="mb-2 mt-2 flex flex-row items-start gap-2">
                  <div className="px-2 py-1 bg-gray-800 text-gray-200 rounded-md text-sm flex flex-row w-max">
                    <Calendar size={16} className="mr-1 mt-0.5"/>
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </div>
                  {article.categorie.map((cat) => (
                    <span key={randKey(cat.nome)} className="px-2 py-1 text-sm bg-gray-300 text-gray-800 rounded-md mr-2">{cat.nome}</span>
                  ))}
                </div>
                <div className="text-justify text-gray-500 hidden 2xl:block">
                  {generateEllipsizedText(article.contenuto, 380)}
                </div>
                <div className="text-justify text-gray-500 hidden xl:block 2xl:hidden">
                  {generateEllipsizedText(article.contenuto, 240)}
                </div>
                <div className="text-justify text-gray-500 md:block lg:block xl:hidden 2xl:hidden">
                  {generateEllipsizedText(article.contenuto, 180)}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {loading && (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[100px] w-full rounded-md mb-3" />
          ))}
        </>
      )}
      <div className="flex w-full justify-end">
        <button onClick={loadMore} disabled={loading} className="px-3 py-2 bg-app-1 text-white gap-2 rounded-md ">
          Carica altri...
        </button>
      </div>
    </div>
  );
}