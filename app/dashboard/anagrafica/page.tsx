import { auth } from "@/auth";
import {PrismaClient, TipoSocio} from "@prisma/client";
import type {Metadata} from "next";
import ErrorAlert from "@/components/error-alert";
import PageTitleInjector from "@/components/page-title-injector";
import {Suspense} from "react";
import DbLoading from "@/components/db-loading";
import GestioneSociTable from "@/app/dashboard/anagrafica/table";

export const metadata: Metadata = {
  title: "Gestione Soci - Atletica Padre Pio",
  description: "Atletica Padre Pio – sito ufficiale San Giovanni Rotondo",
};

const prisma = new PrismaClient();

export default async function GestioneSociPage(
  { searchParams }: { searchParams: {
      [key: string]: string }
  }
) {
  const session = await auth();
  if(!session || session.user.role !== TipoSocio.ADMIN){
    return <ErrorAlert error='Sessione non valida, si prega di riautenticarsi' />;
  }

  const key = (await searchParams).key;
  const data = prisma.socio.findMany();

  return (
    <section>
      <PageTitleInjector pageTitle="Gestione Soci" />
      <Suspense fallback={<DbLoading />} key={key}>
        <GestioneSociTable dataPromise={data} />
      </Suspense>
    </section>
  );
}
