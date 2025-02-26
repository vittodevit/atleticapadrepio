import React from "react";
import WebsiteSitebar from "@/components/website-sitebar";

export default async function WithSidebarLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <div className="flex flex-row justify-center">
      <section className="container grid grid-cols-1 xl:grid-cols-[1fr_auto]">
        <div>
          {children}
        </div>
        <div className="bg-white shadow-md xl:mt-16 mb-4 p-4 mx-4">
            <WebsiteSitebar />
        </div>
      </section>
    </div>
  );
}
