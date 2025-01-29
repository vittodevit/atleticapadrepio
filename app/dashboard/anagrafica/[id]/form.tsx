import {Socio, TipoSocio} from "@prisma/client";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface SocioFormProps {
  socio?: Partial<Socio>;
  onChange: (updatedData: Partial<Socio>) => void;
}

const SocioForm: React.FC<SocioFormProps> = ({socio, onChange}) => {
  const [formValues, setFormValues] = useState(socio || {});

  useEffect(() => {
    setFormValues(socio || {});
  }, [socio]);

  useEffect(() => {
    onChange(formValues);
  }, [formValues])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formValues, [name]: value };
    setFormValues(updatedData);
    onChange(updatedData);
  };

  const handleSelectChange = (value: string) => {
    const updatedData = { ...formValues, tipoSocio: value as TipoSocio };
    setFormValues(updatedData);
    onChange(updatedData);
  };

  return (
    <section>
      <div className="grid grid-flow-col grid-rows-1 gap-3">
        <div className="col-span-4">
          <Label htmlFor="nome">Nome *</Label>
          <Input
            name="nome"
            id="nome"
            className="mb-3 mt-1"
            value={formValues.nome || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-span-4">
          <Label htmlFor="cognome">Cognome *</Label>
          <Input
            name="cognome"
            id="cognome"
            className="mb-3 mt-1"
            value={formValues.cognome || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="tipoSocio">Tipologia socio *</Label>
          <div id="tipoSocio" className="mb-3 mt-1">
            <Select name="tipoSocio" onValueChange={handleSelectChange} value={formValues.tipoSocio || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipologia socio" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(TipoSocio).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-flow-col grid-rows-1 gap-3">
        <div>
          <Label htmlFor="email">Indirizzo Email *</Label>
          <Input
            name="email"
            id="email"
            type="email"
            className="mb-3 mt-1"
            value={formValues.email || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="codiceFiscale">Codice Fiscale *</Label>
          <Input
            name="codiceFiscale"
            id="codiceFiscale"
            className="mb-3 mt-1"
            value={formValues.codiceFiscale || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="numeroTelefono">Numero di telefono</Label>
          <Input
            name="numeroTelefono"
            id="numeroTelefono"
            className="mb-3 mt-1"
            value={formValues.numeroTelefono || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-flow-col grid-rows-1 gap-3">
        <div className="col-span-4">
          <Label htmlFor="luogoNascita">Luogo di nascita</Label>
          <Input
            name="luogoNascita"
            id="luogoNascita"
            className="mb-3"
            value={formValues.luogoNascita || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-1">
          <Label htmlFor="dataNascita">Data di nascita *</Label>
          <Input
            name="dataNascita"
            id="dataNascita"
            className="mb-3"
            type="date"
            value={formValues.dataNascita ? new Date(formValues.dataNascita).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-flow-col grid-rows-1 gap-3">
        <div className="col-span-6">
          <Label htmlFor="luogoResidenza">Luogo di residenza</Label>
          <Input
            name="luogoResidenza"
            id="luogoResidenza"
            value={formValues.luogoResidenza || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-10">
          <Label htmlFor="indirizzo">Indirizzo</Label>
          <Input
            name="indirizzo"
            id="indirizzo"
            className="mb-3"
            value={formValues.indirizzo || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-1">
          <Label htmlFor="cap">Cap</Label>
          <Input
            name="cap"
            id="cap"
            className="mb-3"
            value={formValues.cap || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-1">
          <Label htmlFor="provincia">Provincia</Label>
          <Input
            name="provincia"
            id="provincia"
            className="mb-3"
            value={formValues.provincia || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );

}

export default SocioForm;