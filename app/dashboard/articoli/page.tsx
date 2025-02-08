import { auth } from "@/auth";
import {PrismaClient, TipoSocio} from "@prisma/client";
import type {Metadata} from "next";
import ErrorAlert from "@/components/error-alert";
import PageTitleInjector from "@/components/page-title-injector";
import {Suspense} from "react";
import DbLoading from "@/components/db-loading";
import GestioneArticoliTable from "@/app/dashboard/articoli/table";

export const metadata: Metadata = {
  title: "Articoli - Atletica Padre Pio",
  description: "Atletica Padre Pio – sito ufficiale San Giovanni Rotondo",
};

const prisma = new PrismaClient();

export default async function GestioneArticoliPage(
  { searchParams }: { searchParams: {
      [key: string]: string }
  }
) {
  const session = await auth();
  const sp = await searchParams;
  if(!session || session.user.role !== TipoSocio.ADMIN){
    return <ErrorAlert error='Sessione non valida, si prega di riautenticarsi' />;
  }

  const data = prisma.articolo.findMany(
    {
      orderBy: {
        updatedAt: 'desc',
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
          }
        },
      },
    }
  );

  return (
    <section>
      <PageTitleInjector pageTitle="Articoli" />
      <Suspense fallback={<DbLoading />} key={sp.key}>
        <GestioneArticoliTable dataPromise={data} />
      </Suspense>
    </section>
  );
}
