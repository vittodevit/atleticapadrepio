import type {Metadata} from "next";
import {auth} from "@/auth";
import {PrismaClient, Socio, TipoSocio} from "@prisma/client";
import ErrorAlert from "@/components/error-alert";
import {Suspense} from "react";
import DbLoading from "@/components/db-loading";
import PageTitleInjector from "@/components/page-title-injector";
import ArticoloCreateUI from "@/app/dashboard/articoli/[id]/ui";


export const metadata: Metadata = {
  title: "Crea/Modifica Articolo - Atletica Padre Pio",
  description: "Atletica Padre Pio – sito ufficiale San Giovanni Rotondo",
};

const getSocioById = async (id: string): Promise<Socio> => {
  const prisma = new PrismaClient();
  const data = prisma.articolo.findUnique({
    where: {
      id: id,
    },
    include: {
      categorie: true,
      immagineCopertina: true
    }
  });
  if(!data) throw new Error("Articolo non trovato");
  // lo sto verificando sopra stai chill!
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return data;
}

export default async function CreaModificaArticoloPage(
  {
    params,
  }: { params: Promise<{ id: string }>;
  }) {
  const session = await auth();
  if(!session || session.user.role !== TipoSocio.ADMIN){
    return <ErrorAlert error='Sessione non valida, si prega di riautenticarsi' />;
  }

  const paramId = (await params).id;
  if(!paramId) {
    return <ErrorAlert error='Parametro [id] non valido' />;
  }

  const prisma = new PrismaClient();
  const immagini = prisma.immagine.findMany({});
  const categorie = prisma.categoria.findMany({});

  if(paramId === "new"){
    return (
      <section>
        <PageTitleInjector pageTitle={"Crea Articolo"} />
        <Suspense fallback={<DbLoading />}>
          <ArticoloCreateUI
            immaginiPromise={immagini}
            categoriePromise={categorie}
          />
        </Suspense>
      </section>
    );
  } else {
    let data;
    try {
      data = getSocioById(paramId);
    } catch (error) {
      return <ErrorAlert error={`Errore nel recupero dei dati: ${error}`}/>;
    }

    return (
      <section>
        <PageTitleInjector pageTitle={"Modifica Articolo"} />
        <Suspense fallback={<DbLoading />}>
          <ArticoloCreateUI
            dbResult={data}
            objectId={paramId}
            immaginiPromise={immagini}
            categoriePromise={categorie}
          />
        </Suspense>
      </section>
    );
  }
}