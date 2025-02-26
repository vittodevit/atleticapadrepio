"use client"

import {usePageTitle} from "@/components/page-title-context";
import {GlobeLock} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function PageTitle() {
  const title = usePageTitle().pageTitleData;
  const router = useRouter();

  return (
    <div className={`flex flex-row justify-between items-center w-full`}>
      <div>
        <h1 className={`text-lg font-semibold`}>
          {title}
        </h1>
      </div>
      <div>
        <Button onClick={() => router.push("/")}>
          <GlobeLock /> Torna al sito
        </Button>
      </div>
    </div>
  );
}
