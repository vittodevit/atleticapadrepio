"use client";
import React, {use} from 'react';
import Autoplay from "embla-carousel-autoplay"
import {Immagine} from "@prisma/client";

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

interface CarouselSponsorProps {
  sponsorPromise?: Promise<Immagine[]>;
  sponsorNonPromise?: Immagine[];
  showBadge?: boolean;
  trasformaInCarouselGalleria?: boolean;
}

const CarouselSponsor: React.FC<CarouselSponsorProps> = (
  {sponsorPromise, showBadge, sponsorNonPromise, trasformaInCarouselGalleria}
) => {

  const plugin = React.useRef(
    Autoplay({delay: 2000, stopOnInteraction: true})
  )

  let fotoSponsor: Immagine[] = [];

  if (sponsorNonPromise) {
    fotoSponsor = sponsorNonPromise
  }else{
    fotoSponsor = use(sponsorPromise!);
  }

  return (

    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {fotoSponsor.map((foto, index) => (
            (trasformaInCarouselGalleria ? foto.includeInGallery : foto.includeInSponsor) == false ? null : (
              <CarouselItem key={foto.id + index}>
                <Card className="rounded-none bg-white shadow-md border-1">
                  <CardContent
                    className="flex h-64 p-4 bg-cover bg-center pl-2"
                    style={{
                      backgroundImage: `url(/api/images/${foto.id})`,
                      backgroundSize: trasformaInCarouselGalleria ? "125%" : "90%",
                    }}
                  >
                    {showBadge && (
                      <div className="text-white w-4/5">
                  <span
                    className="font-bold p-2.5 pl-3 pr-3 bg-black bg-opacity-50 rounded-md"
                  >
                    I nostri sponsor...
                  </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            )
        ))}
      </CarouselContent>
      <CarouselPrevious/>
      <CarouselNext/>
    </Carousel>
  );
}

export default CarouselSponsor;