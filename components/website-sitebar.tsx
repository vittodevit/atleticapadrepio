"use client"
import React, {use} from "react";
import Link from "next/link";
import {Facebook, Mail} from "lucide-react";
import CarouselSponsor from "@/app/(website)/carousel-sponsor";
import {Immagine} from "@prisma/client";

interface WebsiteSitebarProps {
  immaginiPromise: Promise<Immagine[]>;
}

export default function WebsiteSitebar({immaginiPromise} : WebsiteSitebarProps) {
  const immagini = use(immaginiPromise);

  return (
    <section className="grid grid-cols-1 gap-5">
      <div className="grid grid-cols-1 gap-2">
        <h4 className="font-bold">I nostri sponsor: </h4>
        <div className="w-full md:w-80 mb-2">
          <CarouselSponsor sponsorNonPromise={immagini} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <h4 className="font-bold">Trovaci anche su: </h4>
        <div>
          <Link
            href="https://www.facebook.com/atletica.padrepio"
            style={{ backgroundColor: "#0766ff" }}
            className="p-3 font-bold text-white rounded-md flex flex-row gap-2 mb-2"
          >
            <Facebook size={24} className="mr-2"/>
            Facebook
          </Link>
          <Link
            href="mailto:info@atleticapadrepio.it"
            style={{ backgroundColor: "#e3247d" }}
            className="p-3 font-bold text-white rounded-md flex flex-row gap-2"
          >
            <Mail size={24} className="mr-2"/>
            info@atleticapadrepio.it
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <h4 className="font-bold">Le ultime foto: </h4>
        <div className="w-full md:w-80 mb-2">
          <CarouselSponsor sponsorNonPromise={immagini} trasformaInCarouselGalleria={true} />
        </div>
      </div>
    </section>
  );
}
