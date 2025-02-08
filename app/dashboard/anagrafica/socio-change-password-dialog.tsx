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
import {Key} from "lucide-react";
import React, {useActionState, useEffect, useState} from "react";
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import {FormAction, ObjectId} from "@/components/form-action";
import {Socio} from "@prisma/client";
import resetPasswordSocioAction from "@/actions/reset-pass-socio";

interface SocioChangePasswordDialogProps {
  isDialogOpen: boolean;
  dialogData: string;
  tableData: Socio[];
  setIsDialogOpen: (open: boolean) => void;
  invalidateDialog: () => void;
}

export function SocioChangePasswordDialog(
  { isDialogOpen, setIsDialogOpen, dialogData, tableData, invalidateDialog }: SocioChangePasswordDialogProps) {
  const [state, formAction, pending] = useActionState(resetPasswordSocioAction, {success: false, message: ''});
  const [selectedSocio, setSelectedSocio] = useState<Socio>();

  useEffect(() => {
    if(!isDialogOpen && state.success === true){
      invalidateDialog();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if(dialogData){
      const socio =
        tableData.find((socio) => socio.id === dialogData);
      setSelectedSocio(socio);
    }
  }, [dialogData]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Rigenerazione password</DialogTitle>
            <DialogDescription>
              Conferma la rigenerazione password del seguente socio
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 mb-3">
            <ConditionalHider hidden={!pending}>
              <DbLoading />
            </ConditionalHider>
            <ConditionalHider hidden={!state.message || pending}>
              <ConditionalHider hidden={state.success === true}>
                <ErrorAlert error={state.message}/>
              </ConditionalHider>
              <ConditionalHider hidden={!state.success}>
                {/*Porcata immensa! Sto usando sempre il componente di errore per mostrare uno stato di successo!*/}
                <ErrorAlert error={state.message} isSuccess/>
              </ConditionalHider>
            </ConditionalHider>
          </div>
          <ObjectId objectId={dialogData} />
          <FormAction changePassword />
          <ConditionalHider hidden={pending || (state.success === true)}>
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
              <Button type="submit">
                <Key />
                Conferma
              </Button>
            </DialogFooter>
          </ConditionalHider>
        </form>
      </DialogContent>
    </Dialog>
  );
}
