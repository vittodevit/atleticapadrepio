"use client"
import {Immagine} from "@prisma/client";
import {use, useState} from "react";
import Image from "next/image";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {niceTimestamp} from "@/lib/utils";
import {Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ImageDeleteDialog} from "@/app/dashboard/immagini/image-delete-dialog";

interface ImageGalleryProps {
  dataPromise: Promise<Immagine[]>;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ dataPromise }) => {
  const galleryData = use(dataPromise);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{immagine.altText}</span>
              <Button variant="destructive" size="icon" onClick={() => {
                setDialogData(immagine);
                setIsDialogOpen(true);
              }}>
                <Trash2 />
              </Button>
            </div>
            <hr className="mt-2 mb-2" />
            <div className="text-gray-500">
              <span className="font-semibold">ObjectID: </span> {immagine.id} <br />
              <span className="font-semibold">Inclusa in Photo Gallery: </span>
              {immagine.includeInGallery ? 'Si' : 'No'}<br />
              <span className="font-semibold">Ultima modifica: </span> {niceTimestamp(immagine.updatedAt)} <br />
            </div>
          </PopoverContent>
        </Popover>
      ))}
      <ImageDeleteDialog isDialogOpen={isDialogOpen} dialogData={dialogData} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
}

export default ImageGallery;