import { auth } from "@/auth";
import {PrismaClient} from "@prisma/client";
import type {Metadata} from "next";
import ErrorAlert from "@/components/error-alert";
import PageTitleInjector from "@/components/page-title-injector";
import {Suspense} from "react";
import DbLoading from "@/components/db-loading";
import GestioneDocumentiTable from "@/app/dashboard/documenti/table";

export const metadata: Metadata = {
  title: "Documenti Soci - Atletica Padre Pio",
  description: "Atletica Padre Pio – sito ufficiale San Giovanni Rotondo",
};

const prisma = new PrismaClient();

export default async function GestioneDocumentiPage(
  { searchParams }: { searchParams: {
      [key: string]: string }
  }
) {
  const session = await auth();
  if(!session){
    return <ErrorAlert error='Sessione non valida, si prega di riautenticarsi' />;
  }

  const editingEnabled = session.user.role === 'ADMIN';
  const key = (await searchParams).key;
  const data = prisma.documento.findMany(
    {
      where: {
        tipoSociDestinatari: {
          has: session.user.role,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      }
    }
  );

  return (
    <section>
      <PageTitleInjector pageTitle="Documenti" />
      <Suspense fallback={<DbLoading />} key={key}>
        <GestioneDocumentiTable dataPromise={data} editingEnabled={editingEnabled} />
      </Suspense>
    </section>
  );
}
