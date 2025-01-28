"use client"
import {Immagine} from "@prisma/client";
import {use, useState} from "react";
import Image from "next/image";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {niceTimestamp} from "@/lib/utils";
import {HandCoins, Images, Pencil, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ImageDeleteDialog} from "@/app/dashboard/immagini/image-delete-dialog";
import ConditionalHider from "@/components/conditional-hider";
import {ImageEditDialog} from "@/app/dashboard/immagini/image-edit-dialog";

interface ImageGalleryProps {
  dataPromise: Promise<Immagine[]>;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ dataPromise }) => {
  const galleryData = use(dataPromise);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<Partial<Immagine>>({});

  if(galleryData.length === 0){
    return (
      <div className="mt-7 text-center text-gray-500">
        <span>Nessuna immagine presente</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {galleryData.map((immagine) => (
        <Popover key={immagine.id}>
          <PopoverTrigger asChild>
            <div className="relative w-60 h-60">
              <Image
                className="rounded-lg border border-gray-500"
                key={immagine.id}
                src={`/api/images/${immagine.id}`}
                alt={immagine.altText}
                layout="fill"
                objectFit="cover"
              />

              {/*TODO: porcata immensa, si fa con molto meno codice!!!*/}

              <ConditionalHider hidden={!(immagine.includeInGallery && !immagine.includeInSponsor)}>
                <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                  <Images size={16} />
                </div>
              </ConditionalHider>

              <ConditionalHider hidden={!(immagine.includeInSponsor && !immagine.includeInGallery)}>
                <div className="absolute top-2 left-2 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded">
                  <HandCoins size={16} />
                </div>
              </ConditionalHider>

              <ConditionalHider hidden={!(immagine.includeInSponsor && immagine.includeInGallery)}>
                <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                  <Images size={16} />
                </div>
                <div className="absolute top-2 left-11 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded">
                  <HandCoins size={16} />
                </div>
              </ConditionalHider>

            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{immagine.altText}</span>
              <div>
                <div className="flex gap-2">
                  <Button size="icon" onClick={() => {
                    setDialogData(immagine);
                    setIsEditDialogOpen(true);
                  }}>
                    <Pencil />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => {
                      setDialogData(immagine);
                      setIsDeleteDialogOpen(true);
                    }}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
            <hr className="mt-2 mb-2" />
            <div className="text-gray-500">
              <span className="font-semibold">ObjectID: </span> {immagine.id} <br />
              <span className="font-semibold">Inclusa in Photo Gallery: </span>
              {immagine.includeInGallery ? 'Si' : 'No'}<br />
              <span className="font-semibold">Inclusa in Sponsor Gallery: </span>
              {immagine.includeInSponsor ? 'Si' : 'No'}<br />
              <span className="font-semibold">Ultima modifica: </span> {niceTimestamp(immagine.updatedAt)} <br />
            </div>
          </PopoverContent>
        </Popover>
      ))}
      <ImageDeleteDialog isDialogOpen={isDeleteDialogOpen} dialogData={dialogData} setIsDialogOpen={setIsDeleteDialogOpen} />
      <ImageEditDialog isDialogOpen={isEditDialogOpen} dialogData={dialogData} setIsDialogOpen={setIsEditDialogOpen} />
    </div>
  );
}

export default ImageGallery;