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
import crudCategorieAction from "@/actions/crud-categorie";
import {FormAction, ObjectId} from "@/components/form-action";
import {Categoria} from "@prisma/client";

interface CategoriaDeleteDialogProps {
  isDialogOpen: boolean
  dialogData: string; // categoria id
  tableData: Categoria[];
  setIsDialogOpen: (open: boolean) => void
}

export function CategoriaDeleteDialog(
  { isDialogOpen, setIsDialogOpen, dialogData, tableData }: CategoriaDeleteDialogProps) {
  const [state, formAction, pending] = useActionState(crudCategorieAction, {message: ''});
  const router = useRouter();
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria>();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if(dialogData){
      const categoria =
        tableData.find((categoria) => categoria.id === dialogData);
      if(categoria !== undefined){
        setSelectedCategoria(categoria);
      }
    }
  }, [dialogData]);

  useEffect(() => {
    if(state.message === 'success'){
      setIsDialogOpen(false);
      toast.success('Categoria eliminata con successo');
      updateQueryParams('key', Math.random().toString());
    }
  }, [state]);

  return state.message !== 'success' ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Elimina categoria</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare la seguente categoria?
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
              <span className="font-semibold">Nome: </span> {" "}
              {selectedCategoria?.nome}<br />
              <span className="font-semibold">Descrizione: </span> {" "}
              {selectedCategoria?.descrizione}<br />
              <span className="font-semibold">Slug: </span> {" "}
              {selectedCategoria?.slug}<br />
              <span className="font-semibold">ObjectID: </span> {selectedCategoria?.id} <br />
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
