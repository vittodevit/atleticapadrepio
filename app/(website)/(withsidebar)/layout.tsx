import React, {Suspense} from "react";
import WebsiteSitebar from "@/components/website-sitebar";
import {PrismaClient} from "@prisma/client";
import {Skeleton} from "@/components/ui/skeleton";

const prisma = new PrismaClient();

export default async function WithSidebarLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  }) {

  const tutteLeImmagini = prisma.immagine.findMany(
    {
      where: {
        OR: [
          { includeInSponsor: true },
          { includeInGallery: true }
        ]
      }
    }
  )

  return (
    <div className="flex flex-row justify-center">
      <section className="container grid grid-cols-1 xl:grid-cols-[1fr_auto]">
        <div>
          {children}
        </div>
        <div className="bg-white shadow-md xl:mt-16 mb-4 p-4 mx-4">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <WebsiteSitebar immaginiPromise={tutteLeImmagini} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
