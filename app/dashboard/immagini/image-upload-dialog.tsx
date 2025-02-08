import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Save} from "lucide-react";
import {useActionState, useEffect, useState} from "react";
import saveImageAction from "@/actions/save-image";
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {Checkbox} from "@/components/ui/checkbox";

interface ImageUploadDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
}

export function ImageUploadDialog({ isDialogOpen, setIsDialogOpen }: ImageUploadDialogProps) {
  const [state, formAction, pending] = useActionState(saveImageAction, {message: ''});
  const [altText, setAltText] = useState('');
  const [isGalleryChecked, setIsGalleryChecked] = useState(false);
  const [isSponsorChecked, setIsSponsorChecked] = useState(false);
  const router = useRouter();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if(state.message === 'success'){
      setIsDialogOpen(false);
      toast.success('Immagine caricata con successo');
      updateQueryParams('key', Math.random().toString());
    }
  }, [state]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Upload Immagini</DialogTitle>
            <DialogDescription>
              Per utilizzare le immagini nei post, caricale qui
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3">
            <ConditionalHider hidden={!pending}>
              <DbLoading />
            </ConditionalHider>
            <ConditionalHider hidden={!state.message || pending}>
              <ErrorAlert error={state.message} />
            </ConditionalHider>
          </div>
          <div className="grid gap-4 py-4 mb-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageFile" className="text-right">
                Immagine
              </Label>
              <Input id="imageFile" name="imageFile" type="file" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="altText" className="text-right">
                Descrizione
              </Label>
              <Input 
                id="altText" 
                name="altText" 
                className="col-span-3" 
                value={altText} 
                onChange={(e) => setAltText(e.target.value)} 
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <div className="w-max gap-2 flex row-auto">
                <Checkbox
                  id="includeInGallery"
                  name="includeInGallery"
                  value="true"
                  checked={isGalleryChecked}
                  onCheckedChange={(c) => setIsGalleryChecked(c === true)}
                />
                <label htmlFor="includeInGallery" className="text-sm font-medium leading-none block mt-0.5">
                  Includi nella Photo Gallery
                </label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <div className="w-max gap-2 flex row-auto">
                <Checkbox
                  id="includeInSponsor"
                  name="includeInSponsor"
                  value="true"
                  checked={isSponsorChecked}
                  onCheckedChange={(c) => setIsSponsorChecked(c === true)}
                />
                <label htmlFor="includeInSponsor" className="text-sm font-medium leading-none block mt-0.5">
                  Includi nella Sponsor Gallery
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <Save />
              Salva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
