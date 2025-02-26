import DiCarloPasquale from "./foto/DiCarloPasquale.jpg";
import GiovanniCocomazzi from "./foto/GiovanniCocomazzi.jpg";
import DonatoMaresca from "./foto/DonatoMaresca.jpg";
import LongoAntonio from "./foto/LongoAntonio.jpg";
import DraganoBartolomeo from "./foto/DraganoBartolomeo.jpg";
import PasqualeCocomazzi from "./foto/PasqualeCocomazzi.jpg";
import PietroUrbano from "./foto/PietroUrbano.jpg";
import NataleAnnaMaria from "./foto/NataleAnnaMaria.jpg";
import GiuseppeChiumento from "./foto/GiuseppeChiumento.jpg";
import NicolaPlacentino from "./foto/NicolaPlacentino.jpg";
import Image, {StaticImageData} from "next/image";
import {Mail, Phone} from "lucide-react";

export default function Home() {
  return (
    <div className="p-4 pl-0 pr-0 mx-4 md:mx-0">
      <h1 className="text-2xl font-medium">Direttivo</h1>
      <Card
        role="PRESIDENTE e ISTRUTTORE FIDAL"
        name="NICOLA PLACENTINO"
        email="presidente@atleticapadrepio.it"
        mail2="ds.istruttore@atleticapadrepio.it"
        phone="+39 333 275 7099"
        picture={NicolaPlacentino}
      />
      <Card
        role="VICE-PRESIDENTE"
        name="DI CARLO PAQUALE"
        email="vicepresidente@atleticapadrepio.it"
        phone="+39 333 475 6368"
        picture={DiCarloPasquale}
      />
      <Card
        role="WEB MASTER"
        name="CHIUMENTO GIUSEPPE"
        email="gchiumento@gmail.com"
        phone="+39 389 056 2562"
        picture={GiuseppeChiumento}
      />
      <Card
        role="CONSIGLIERE – MAGAZZINIERE"
        name="GIOVANNI COCOMAZZI"
        email="giovanni.cocomazzi@alice.it"
        phone="+39 335 1834035"
        picture={GiovanniCocomazzi}
      />
      <Card
        role="TESORIERE – SEGRETARIO – ADDETTO STAMPA"
        name="URBANO PIETRO"
        email="segreteria@atleticapadrepio.it"
        phone="+39 329 391 3204"
        picture={PietroUrbano}
      />
      <Card
        role="RESPOSANBILE SAFEGUARDING  E SOCIAL MEDIA MANAGEMENT"
        name="NATALE ANNA MARIA"
        email="annamarianatale76@gmail.com"
        phone="+39 329 492 2486"
        picture={NataleAnnaMaria}
      />
      <Card
        role="CONSIGLIERE"
        name="COCOMAZZI PASQUALE"
        email="pasquale.cocomazzi31@gmail.com"
        phone="+39 340 534 7967"
        picture={PasqualeCocomazzi}
      />
      <div className="mt-5">
        <h2 className="text-2xl font-medium">Collaboratori</h2>
      </div>
      <Card
        role="COLLABORATORE"
        name="DRAGANO BARTOLOMEO"
        email="draganobartolomeo@libero.it"
        phone="+39 339 759 2910"
        picture={DraganoBartolomeo}
      />
      <Card
        role="COLLABORATORE"
        name="MARESCA DONATO"
        email="donato.maresca1967@libero.it"
        phone="+39 320 698 7911"
        picture={DonatoMaresca}
      />
      <Card
        role="COLLABORATORE"
        name="LONGO ANTONIO"
        email="antonio.longo2160@gmail.com"
        phone="+39 349 443 6530"
        picture={LongoAntonio}
      />
    </div>
  );
}

interface CardProps {
  role: string;
  name: string;
  email: string;
  mail2?: string;
  phone: string;
  picture: StaticImageData;
}

function Card({role, name, email, mail2, phone, picture} : CardProps) {
  return (
    <div className="p-5 bg-white shadow-md mt-4">
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <div className="relative md:w-40 md:h-60 w-24 h-40 rounded-lg">
          <Image
            className="rounded-lg"
            src={picture}
            alt={name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <h2 className="bold text-lg font-medium text-justify mb-1">{name}</h2>
          <div className="text-justify text-gray-500 text-sm md:text-base">
            {role}
          </div>
          <div className="mb-2 mt-2 flex flex-row flex-wrap items-start gap-2">
            <div className="px-2 py-1 bg-gray-200 text-black rounded-md text-xs md:text-sm flex flex-row">
              <Phone size={16} className="mr-1 mt-0.5"/>
              {phone}
            </div>
            <div className="px-2 py-1 bg-gray-200 text-black rounded-md text-xs md:text-sm flex flex-row ">
              <Mail size={16} className="mr-1 mt-0.5"/>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
            {mail2?.includes("@") && (
              <div className="px-2 py-1 bg-gray-200 text-black rounded-md text-xs md:text-sm flex flex-row">
                <Mail size={16} className="mr-1 mt-0.5"/>
                <a href={`mailto:${mail2}`}>{mail2}</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
* <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">

        <div>
          <h2 className="bold text-lg font-medium text-justify mb-1">{name}</h2>
          <div className="mb-2 mt-2 flex flex-row items-start gap-2">
            <div className="px-2 py-1 bg-gray-800 text-gray-200 rounded-md text-sm flex flex-row">
              <Phone size={16} className="mr-1 mt-0.5"/>
              {phone}
            </div>
            <div className="px-2 py-1 bg-gray-800 text-gray-200 rounded-md text-sm flex flex-row ">
              <Mail size={16} className="mr-1 mt-0.5"/>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
            {mail2?.includes("@") && (
              <div className="px-2 py-1 bg-gray-800 text-gray-200 rounded-md text-sm flex flex-row">
                <Mail size={16} className="mr-1 mt-0.5"/>
                <a href={`mailto:${mail2}`}>{mail2}</a>
              </div>
            )}
          </div>
          <div className="text-justify text-gray-500 hidden 2xl:block">
            {role}
          </div>
        </div>
      </div>
* */