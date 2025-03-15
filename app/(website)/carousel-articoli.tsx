"use client";
import React, {use} from 'react';
import Autoplay from "embla-carousel-autoplay"
import {Articolo} from "@prisma/client";

import {Card, CardContent} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {toNiceDateNoTime} from "@/lib/utils";
import {Calendar} from "lucide-react";
import Link from "next/link";

interface CarouselArticoliProps {
  articoliPromise: Promise<Articolo[]>;
}

const CarouselArticoli: React.FC<CarouselArticoliProps> = ({articoliPromise}) => {

  const plugin = React.useRef(
    Autoplay({delay: 2000, stopOnInteraction: true})
  )

  const articoli = use(articoliPromise);

  return (

    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {articoli.map((article, index) => (
          <CarouselItem key={article.id}>
            <Card className="rounded-none bg-white shadow-md border-1">
              <CardContent
                className="flex h-64 items-center justify-center p-6 bg-cover bg-center"
                style={{
                  backgroundImage: `url(/api/images/${article.immagineCopertina.id})`,
                  backgroundSize: "110%",
                  backgroundColor: "#404040",
                  backgroundBlendMode: "overlay",
                }}
              >
                <div className="text-white text-center w-4/5">
                  <Link href={"/articoli/" + article.slug}>
                    <h2
                      className="text-2xl font-bold"
                      style={{
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {article.titolo}
                    </h2>
                  </Link>
                  <div
                    className="text-sm flex flex-row justify-center gap-2 mt-1 w-full"
                  >
                    <Calendar
                      size={16}
                      className="mt-0.5 shadow-md"
                      style={{
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                      }}
                    />
                    <div
                      style={{
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {toNiceDateNoTime(new Date(article.updatedAt))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious/>
      <CarouselNext/>
    </Carousel>
  );
}

export default CarouselArticoli;