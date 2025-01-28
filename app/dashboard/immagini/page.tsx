import { auth } from "@/auth";
import {PrismaClient, TipoSocio} from "@prisma/client";
import type {Metadata} from "next";
import ErrorAlert from "@/components/error-alert";
import PageTitleInjector from "@/components/page-title-injector";
import {Suspense} from "react";
import DbLoading from "@/components/db-loading";
import ImageGallery from "@/app/dashboard/immagini/image-gallery";

export const metadata: Metadata = {
  title: "Galleria Immagini - Atletica Padre Pio",
  description: "Atletica Padre Pio – sito ufficiale San Giovanni Rotondo",
};

const prisma = new PrismaClient();

export default async function LuoghiProduzionePage(
  { searchParams }: { searchParams: {
    [key: string]: string }
  }
) {
  const session = await auth();
  if(!session || session.user.role !== TipoSocio.ADMIN){
    return <ErrorAlert error='Sessione non valida, si prega di riautenticarsi' />;
  }

  const sp = (await searchParams);
  const renderKey = sp.key;

  const data = prisma.immagine.findMany();

  return (
    <section>
      <PageTitleInjector pageTitle="Galleria Immagini" />
      <Suspense fallback={<DbLoading />} key={renderKey}>
        <ImageGallery dataPromise={data} />
      </Suspense>
    </section>
  );
}
