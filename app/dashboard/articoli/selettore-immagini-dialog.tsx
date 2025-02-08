import {Button} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Save} from "lucide-react";
import {useEffect, useState} from "react";
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import getAllImagesAction from "@/actions/get-all-images";
import {Immagine} from "@prisma/client";
import Select from "react-select";
import Image from "next/image";

export enum SelectorDestination {
  COPERTINA,
  TINYMCE,
}

export interface NewValue {
  value: string
  label: string
}

interface SelettoreImmaginiDialogProps {
  isDialogOpen: boolean
  selectorDestination: SelectorDestination
  setIsDialogOpen: (open: boolean) => void
  onSave: (image: NewValue, dest: SelectorDestination) => void
}

export function SelettoreImmaginiDialog(
  {
    isDialogOpen,
    setIsDialogOpen,
    selectorDestination,
    onSave
  }: SelettoreImmaginiDialogProps) {
  const [immagini, setImmagini] = useState<Immagine[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<NewValue | undefined>(undefined);

  // map immagini to options for select
  const immaginiOptions = immagini.map((img) => {
    return {
      value: img.id,
      label: img.altText,
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      // non serve passare quei due parametri perchè non sto usando un form ma la sto chiamando direttamente
      // eslint-disable-next-line
      // @ts-expect-error
      const data = await getAllImagesAction();
      if (data.images) {
        setImmagini(data.images);
      } else {
        setError(true);
      }
    };

    fetchData();
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Seleziona immagine</DialogTitle>
          <DialogDescription>
            L&#39;immagine può risultare tagliata, questa è solo un&#39; anteprima!
          </DialogDescription>
        </DialogHeader>
        <ConditionalHider hidden={immagini.length > 0 || error}>
          <div className="mt-3"><DbLoading/></div>
        </ConditionalHider>
        <ConditionalHider hidden={!error}>
          <div className="mt-3">
            <ErrorAlert error="Impossibile ottenere dal server la galleria immagini"/>
          </div>
        </ConditionalHider>
        <div className="grid grid-rows-1 gap-4">
          <Select
            id="immagini"
            className="my-react-select-container col-span-3 w-full"
            classNamePrefix="my-react-select"
            options={immaginiOptions}
            value={selectedImage}
            onChange={(newValue) => {
              if(newValue) {
                setSelectedImage(newValue);
              }
            }}
          />
        </div>
        {selectedImage && (
          <div className="relative w-full h-60">
            <Image
              className="rounded-lg border border-gray-500"
              src={`/api/images/${selectedImage.value}`}
              alt="immagine selezionata"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <DialogFooter>
          <Button
            disabled={!selectedImage}
            type="submit"
            onClick={() => onSave(selectedImage!, selectorDestination)}
          >
            <Save/>
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
