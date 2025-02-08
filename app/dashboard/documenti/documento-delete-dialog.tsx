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
import {Documento} from "@prisma/client";
import crudDocumentiAction from "@/actions/crud-documenti";

interface DocumentoDeleteDialogProps {
  isDialogOpen: boolean
  dialogData: string; // documento id
  tableData: Documento[];
  setIsDialogOpen: (open: boolean) => void
}

export function DocumentoDeleteDialog(
  { isDialogOpen, setIsDialogOpen, dialogData, tableData }: DocumentoDeleteDialogProps) {
  const [state, formAction, pending] = useActionState(crudDocumentiAction, {message: ''});
  const router = useRouter();
  const [selectedDocumento, setSelectedDocumento] = useState<Documento>();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if(dialogData){
      const documento =
        tableData.find((documento) => documento.id === dialogData);
      if(documento !== undefined){
        setSelectedDocumento(documento);
      }
    }
  }, [dialogData]);

  useEffect(() => {
    if(state.message === 'success'){
      setIsDialogOpen(false);
      toast.success('Documento eliminato con successo');
      updateQueryParams('key', Math.random().toString());
    }
  }, [state]);

  return state.message !== 'success' ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Elimina documento</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare il seguente documento?
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
          <FormAction remove />
          <ObjectId objectId={dialogData} />
          <div className="grid gap-4 py-4">
            <div className="mb-4">
              <span className="font-semibold">Titolo: </span> {" "}
              {selectedDocumento?.titolo}<br />
              <span className="font-semibold">Descrizione: </span> {" "}
              {selectedDocumento?.descrizione}<br />
              <span className="font-semibold">ObjectID: </span> {selectedDocumento?.id} <br />
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" type="submit">
              <Trash2 />
              Elimina
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ) : null;
}
