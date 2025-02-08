"use client";
import React, {useActionState, useState, use, useEffect} from 'react';
import {Socio} from "@prisma/client";
import {FormAction, ObjectId} from "@/components/form-action";
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import {CircleArrowLeft, Save} from "lucide-react";
import crudSocioAction from "@/actions/crud-socio";
import {Button} from "@/components/ui/button";
import SocioForm from "@/app/dashboard/anagrafica/[id]/form";
import {useRouter} from "next/navigation";

interface SocioCreateUIProps {
  dbResult?: Promise<Partial<Socio>>;
  objectId?: string;
}

const SocioCreateUI: React.FC<SocioCreateUIProps> = ({ dbResult, objectId }) => {
  const [state, formAction, pending] = useActionState(crudSocioAction, {success: false, message: ''});
  const initialFormData = dbResult ? use(dbResult) : {};
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();

  const handleFormChange = (updatedData: Partial<Socio>) => {
    setFormData(updatedData);
  };

  useEffect(() => {
    setFormData(formData);
  }, [state]);

  return (
    <form action={formAction}>
      {dbResult ? <FormAction update/> : <FormAction create/>}
      <ObjectId objectId={objectId} />
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
      <ConditionalHider hidden={pending || (state.success === true)}>
        <div className="mt-3">
          <SocioForm onChange={handleFormChange} socio={formData} />
        </div>
          <div className="flex gap-2 justify-center w-full">
            <Button
              type='button'
              variant="outline"
              className='mt-3'
              onClick={() => router.push('/dashboard/anagrafica')}
            >
              <CircleArrowLeft />
              Torna Indietro
            </Button>
            <Button type='submit' className='mt-3'>
              <Save />
              {dbResult ? 'Salva modifiche' : 'Salva nuovo'}
            </Button>
          </div>
      </ConditionalHider>
    </form>
  );
};

export default SocioCreateUI;