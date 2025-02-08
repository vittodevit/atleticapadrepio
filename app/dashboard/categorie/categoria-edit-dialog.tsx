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
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import crudCategorieAction from "@/actions/crud-categorie";
import {FormAction, ObjectId} from "@/components/form-action";
import {Categoria} from "@prisma/client";

interface CategoriaEditDialogProps {
  isDialogOpen: boolean
  dialogData: string; // categoria id
  tableData: Categoria[];
  setIsDialogOpen: (open: boolean) => void
}

export function CategoriaEditDialog(
  { isDialogOpen, setIsDialogOpen, dialogData, tableData }: CategoriaEditDialogProps) {
  const [state, formAction, pending] = useActionState(crudCategorieAction, {message: ''});
  const router = useRouter();

  // stati dei fields
  const [nome, setNome] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [slug, setSlug] = useState('');

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
        setNome(categoria.nome);
        setDescrizione(categoria.descrizione || '');
        setSlug(categoria.slug);
      }
    }
  }, [dialogData]);

  useEffect(() => {
    if(state.message === 'success'){
      setIsDialogOpen(false);
      toast.success('Categoria modificata con successo');
      updateQueryParams('key', Math.random().toString());
    }
  }, [state]);

  return state.message !== 'success' ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Modifica categoria</DialogTitle>
            <DialogDescription>
              I campi contrassegnati con (*) sono obbligatori
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
          <FormAction update />
          <ObjectId objectId={dialogData} />
          <div className="grid gap-4 py-4 mb-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome categoria *
              </Label>
              <Input
                id="nome"
                name="nome"
                className="col-span-3"
                placeholder="Nome categoria interessante!"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descrizione" className="text-right">
                Descrizione
              </Label>
              <Input
                id="descrizione"
                name="descrizione"
                className="col-span-3"
                value={descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug *
              </Label>
              <Input
                id="slug"
                name="slug"
                className="col-span-3"
                placeholder="nome-categoria-interessante"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <Save />
              Aggiorna
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ) : null;
}
