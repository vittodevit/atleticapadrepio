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
import {FormAction} from "@/components/form-action";
import crudDocumentiAction from "@/actions/crud-documenti";
import Select, {MultiValue} from "react-select";
import {TipoSocio} from "@prisma/client";

interface DocumentoCreateDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
}

export function DocumentoCreateDialog({isDialogOpen, setIsDialogOpen}: DocumentoCreateDialogProps) {
  const [state, formAction, pending] = useActionState(crudDocumentiAction, {message: ''});
  const router = useRouter();

  // stati dei fields
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [tipoSociDestinatari, setTipoSociDestinatari] = useState<{label: string, value: TipoSocio}[]>([]);

  const handleSelectChange = (e: MultiValue<
    {label: string, value: TipoSocio }
  >) => {
    setTipoSociDestinatari(e as {label: string, value: TipoSocio}[]);
  }

  const tipoSociOptions = (Object.keys(TipoSocio) as Array<keyof typeof TipoSocio>).map((key) => {
    return {label: TipoSocio[key].replace("_", " "), value: key}
  })

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  }

  useEffect(() => {
    if(state.message === 'success'){
      setIsDialogOpen(false);
      toast.success('Documento creato con successo');
      updateQueryParams('key', Math.random().toString());
    }
  }, [state]);

  return state.message !== 'success' ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Crea documento</DialogTitle>
            <DialogDescription>
              I campi contrassegnati con (*) sono obbligatori <br />
              Nei destinatari &#34;ADMIN&#34; viene forzto lato server
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
          <FormAction create />
          <div className="grid gap-4 py-4 mb-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titolo" className="text-right">
                Titolo *
              </Label>
              <Input
                id="titolo"
                name="titolo"
                className="col-span-3"
                value={titolo}
                onChange={(e) => setTitolo(e.target.value)}
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
              <Label htmlFor="tipoSociDestinatari" className="text-right">
                Soci Destinatari *
              </Label>
              <Select
                isMulti
                name="tipoSociDestinatari"
                placeholder="Seleziona i soci destinatari"
                id="tipoSociDestinatari"
                options={tipoSociOptions}
                className="my-react-select-container col-span-3"
                classNamePrefix="my-react-select"
                value={tipoSociDestinatari}
                onChange={handleSelectChange}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="document" className="text-right">
                Documento *
              </Label>
              <Input id="document" name="document" type="file" className="col-span-3" required />
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
  ) : null;
}
