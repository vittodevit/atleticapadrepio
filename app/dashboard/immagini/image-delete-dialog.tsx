"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Trash2} from "lucide-react";
import {useActionState, useEffect} from "react";
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import {toast} from "react-toastify";
import {Immagine} from "@prisma/client";
import {niceTimestamp} from "@/lib/utils";
import deleteImageAction from "@/actions/delete-image-action";
import {useRouter} from "next/navigation";

interface ImageDeleteDialogProps {
  isDialogOpen: boolean;
  dialogData: Partial<Immagine>;
  setIsDialogOpen: (open: boolean) => void;
}

export function ImageDeleteDialog({ isDialogOpen, setIsDialogOpen, dialogData }: ImageDeleteDialogProps) {
  const [state, formAction, pending] = useActionState(deleteImageAction, {message: ''});
  const router = useRouter();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if(state.message === 'success'){
      setIsDialogOpen(false);
      toast.success('Immagine cancellata con successo');
      updateQueryParams('key', Math.random().toString());
    }
  }, [state]);

  return state.message !== 'success' ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Cancella immagine</DialogTitle>
            <DialogDescription>
              Conferma la cancellazione della seguente immagine
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 mb-3">
            <ConditionalHider hidden={!pending}>
              <DbLoading />
            </ConditionalHider>
            <ConditionalHider hidden={!state.message || pending}>
              <ErrorAlert error={state.message} />
            </ConditionalHider>
          </div>
          <input type="hidden" name="paramId" value={dialogData.id} />
          <div className="text-gray-500 mb-5">
            <span className="font-semibold">Didascalia: </span> {dialogData.altText}<br />
            <span className="font-semibold">ObjectID: </span> {dialogData.id} <br />
            <span className="font-semibold">Inclusa in Photo Gallery: </span>
            {dialogData.includeInGallery ? 'Si' : 'No'}<br />
            <span className="font-semibold">Inclusa in Sponsor Gallery: </span>
            {dialogData.includeInSponsor ? 'Si' : 'No'}<br />
            <span className="font-semibold">Ultima modifica: </span> {niceTimestamp(dialogData.updatedAt || new Date())} <br />
          </div>
          <DialogFooter>
            <Button variant="destructive" type="submit">
              <Trash2 />
              Conferma
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ) : null;
}
