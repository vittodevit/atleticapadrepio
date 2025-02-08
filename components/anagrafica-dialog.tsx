'use client';
import React, {useEffect, useState} from 'react';
import {Session} from "next-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import selfAction from "@/actions/self";
import {Socio} from "@prisma/client";
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import {toNiceDateNoTime} from "@/lib/utils";

interface AnagraficaDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const AnagraficaDialog: React.FC<AnagraficaDialogProps> = ({isDialogOpen, setIsDialogOpen}) => {
  const [userData, setUserData] = useState<Socio | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      // non serve passare quei due parametri perchè non sto usando un form ma la sto chiamando direttamente
      // eslint-disable-next-line
      // @ts-expect-error
      const data = await selfAction();
      if (data.user) {
        setUserData(data.user);
      } else {
        setError(true);
      }
    };

    fetchData();
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Informazioni sul socio</DialogTitle>
          <DialogDescription>
            Per modificare le informazioni del socio, contatta l&#39;amministratore
          </DialogDescription>
        </DialogHeader>
        <ConditionalHider hidden={userData !== undefined || error}>
          <div className="mt-3"><DbLoading/></div>
        </ConditionalHider>
        <ConditionalHider hidden={!error}>
          <div className="mt-3">
            <ErrorAlert error={"Impossibile ottenere dal server i dati sul socio"}/>
          </div>
        </ConditionalHider>
        <ConditionalHider hidden={userData === undefined || error}>
          <div className="flex flex-col gap-2">
            <span><b>Nome:</b> {userData?.nome}</span>
            <span><b>Cognome:</b> {userData?.cognome}</span>
            <span><b>Email:</b> {userData?.email}</span>
            <span><b>Codice fiscale:</b> {userData?.codiceFiscale}</span>
            <span><b>Data di nascita:</b> {toNiceDateNoTime(userData?.dataNascita)}</span>
            <hr/>
            <span><b>Luogo di nascita:</b> {userData?.luogoNascita}</span>
            <span><b>Luogo di residenza:</b> {userData?.luogoResidenza}</span>
            <span><b>Indirizzo:</b> {userData?.indirizzo}</span>
            <span><b>CAP:</b> {userData?.cap}</span>
            <span><b>Provincia:</b> {userData?.provincia}</span>
            <span><b>Telefono:</b> {userData?.numeroTelefono}</span>
          </div>
        </ConditionalHider>
      </DialogContent>
    </Dialog>
  );
};

export default AnagraficaDialog;