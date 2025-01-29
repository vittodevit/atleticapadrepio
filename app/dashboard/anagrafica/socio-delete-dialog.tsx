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
import crudSocioAction from "@/actions/crud-socio-action";
import {FormAction, ObjectId} from "@/components/form-action";
import {Socio} from "@prisma/client";

interface SocioDeleteDialogProps {
  isDialogOpen: boolean;
  dialogData: string;
  tableData: Socio[];
  setIsDialogOpen: (open: boolean) => void;
}

export function SocioDeleteDialog({ isDialogOpen, setIsDialogOpen, dialogData, tableData }: SocioDeleteDialogProps) {
  const [state, formAction, pending] = useActionState(crudSocioAction, {success: false, message: ''});
  const [selectedSocio, setSelectedSocio] = useState<Socio>();
  const router = useRouter();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if(dialogData){
      const socio =
        tableData.find((socio) => socio.id === dialogData);
      setSelectedSocio(socio);
    }
  }, [dialogData]);

  useEffect(() => {
    if(state.success === true && state.message === ''){
      setIsDialogOpen(false);
      toast.success('Socio cancellato con successo');
      updateQueryParams('key', Math.random().toString());
    }
  }, [state]);

  return state.success !== true ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Cancella socio</DialogTitle>
            <DialogDescription>
              Conferma la cancellazione del seguente socio
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
            <span className="font-semibold">Nome e Cognome: </span> {" "}
            {selectedSocio?.nome}{" "}{selectedSocio?.cognome}<br />
            <span className="font-semibold">Email: </span> {" "}
            {selectedSocio?.email}<br />
            <span className="font-semibold">Codice Fiscale: </span> {" "}
            {selectedSocio?.codiceFiscale}<br />
            <span className="font-semibold">ObjectID: </span> {selectedSocio?.id} <br />
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
