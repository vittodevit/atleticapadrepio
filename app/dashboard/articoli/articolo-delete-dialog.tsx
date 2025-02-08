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
import {useActionState, useEffect, useState} from "react";
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {FormAction, ObjectId} from "@/components/form-action";
import crudArticoloAction from "@/actions/crud-articolo";
import {DBResult} from "@/app/dashboard/articoli/table";

interface ArticoloDeleteDialogProps {
  isDialogOpen: boolean;
  dialogData: string;
  tableData: DBResult[];
  setIsDialogOpen: (open: boolean) => void;
}

export function ArticoloDeleteDialog({ isDialogOpen, setIsDialogOpen, dialogData, tableData }: ArticoloDeleteDialogProps) {
  const [state, formAction, pending] = useActionState(crudArticoloAction, {success: false, message: ''});
  const [selectedArticolo, setSelectedArticolo] = useState<DBResult>();
  const router = useRouter();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if(dialogData){
      const articolo =
        tableData.find((articolo) => articolo.id === dialogData);
      setSelectedArticolo(articolo);
    }
  }, [dialogData]);

  useEffect(() => {
    if(state.success === true && state.message === ''){
      setIsDialogOpen(false);
      toast.success('Articolo cancellato con successo');
      updateQueryParams('key', Math.random().toString());
    }
  }, [state]);

  return state.success !== true ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Cancella articolo</DialogTitle>
            <DialogDescription>
              Conferma la cancellazione del seguente articolo
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
          <ObjectId objectId={dialogData} />
          <FormAction remove />
          <div className="mb-4">
            <span className="font-semibold">Titolo: </span> {" "}
            {selectedArticolo?.titolo}<br />
            <span className="font-semibold">Slug: </span> {" "}
            {selectedArticolo?.slug}<br />
            <span className="font-semibold">ObjectID: </span> {selectedArticolo?.id} <br />
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
