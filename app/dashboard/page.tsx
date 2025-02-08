import PageTitleInjector from "@/components/page-title-injector";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {PanelLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
    <section>
      <PageTitleInjector pageTitle={"Homepage"} />
      <div className="flex mt-20 w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">Area riservata soci</CardTitle>
                <CardDescription>
                  Benvenuto nell&#39;area riservata!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Tramite il menù laterale
                  <Button variant="outline" size="icon" className="ml-2 mr-2">
                    <PanelLeft />
                  </Button>
                  puoi accedere alle varie sezioni del sito.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
