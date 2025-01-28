"use client"

import {usePageTitle} from "@/components/page-title-context";

export default function PageTitle() {
  const title = usePageTitle().pageTitleData;

  return (
    <h1 className={`text-lg font-semibold`}>
      {title}
    </h1>
  );
}
