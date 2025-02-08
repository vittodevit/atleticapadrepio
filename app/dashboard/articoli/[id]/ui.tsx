"use client";
import React, {useActionState, useState, use, useEffect} from 'react';
import {Articolo, Categoria, Immagine} from "@prisma/client";
import {FormAction, ObjectId} from "@/components/form-action";
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import {CircleArrowLeft, Save} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import dynamic from "next/dynamic";
import crudArticoloAction from "@/actions/crud-articolo";

interface ArticoloCreateUIProps {
  dbResult?: Promise<Partial<Articolo>>;
  immaginiPromise: Promise<Immagine[]>;
  categoriePromise: Promise<Categoria[]>;
  objectId?: string;
}

const DynamicForm = dynamic(() => import('./form'), {
  loading: () => <DbLoading />,
})

const ArticoloCreateUI: React.FC<ArticoloCreateUIProps> = ({ dbResult, objectId, immaginiPromise, categoriePromise }) => {
  const [state, formAction, pending] = useActionState(crudArticoloAction, {success: false, message: ''});
  const initialFormData = dbResult ? use(dbResult) : {};
  const immagini = use(immaginiPromise);
  const categorie = use(categoriePromise);
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();

  const handleFormChange = (updatedData: Partial<Articolo>) => {
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
      </ConditionalHider>
      <ConditionalHider hidden={pending || (state.success === true)}>
        <div className="mt-3">
          <DynamicForm
            onChange={handleFormChange}
            articolo={formData}
            immagini={immagini}
            categorie={categorie}
          />
        </div>
        <div className="flex gap-2 justify-center w-full">
          <Button
            type='button'
            variant="outline"
            className='mt-3'
            onClick={() => router.push('/dashboard/articoli')}
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

export default ArticoloCreateUI;