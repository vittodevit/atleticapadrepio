import type {Metadata} from "next";
import {auth} from "@/auth";
import {TipoSocio} from "@prisma/client";
import ErrorAlert from "@/components/error-alert";
import {Suspense} from "react";
import DbLoading from "@/components/db-loading";
import PageTitleInjector from "@/components/page-title-injector";
import SocioCreateUI from "@/app/dashboard/anagrafica/[id]/ui";
import {getSocioById} from "@/app/dashboard/anagrafica/[id]/database";

export const metadata: Metadata = {
  title: "Crea/Modifica Socio - Atletica Padre Pio",
  description: "Atletica Padre Pio – sito ufficiale San Giovanni Rotondo",
};

export default async function CreaModificaSocioPage(
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

  if(paramId === "new"){
    return (
      <section>
        <PageTitleInjector pageTitle={"Crea Socio"} />
        <SocioCreateUI />
      </section>
    );
  } else {
    const socio = getSocioById(paramId);

    return (
      <section>
        <PageTitleInjector pageTitle={"Modifica Socio"} />
        <Suspense fallback={<DbLoading />}>
          <SocioCreateUI dbResult={socio} objectId={paramId} />
        </Suspense>
      </section>
    );
  }
}