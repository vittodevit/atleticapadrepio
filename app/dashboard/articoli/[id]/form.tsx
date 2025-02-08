"use client"
import {Articolo, Categoria, Immagine} from "@prisma/client";
import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Editor} from "@tinymce/tinymce-react";
import {Editor as EditorType} from "tinymce";
import {Button} from "@/components/ui/button";
import slug from 'slug';
import {Bot, Search} from "lucide-react";
import CreatableSelect from "react-select/creatable";
import Select, {MultiValue} from "react-select";
import {
  NewValue,
  SelectorDestination,
  SelettoreImmaginiDialog
} from "@/app/dashboard/articoli/selettore-immagini-dialog";

interface ArticoloFormProps {
  articolo?: Partial<Articolo>;
  // questa lista immagini viene usata solo in caso di modifica per alimentare il form all'apertura...
  // ...con i dati corretti. la lista aggiornata viene fetchata nel modal di selezione tramite server action
  // questo permette di aggiungere immagini tramite il tasto laterale in sidebar senza dover ricaricare la pagina
  immagini: Immagine[];
  categorie: Categoria[];
  onChange: (updatedData: Partial<Articolo>) => void;
}

const ArticoloForm: React.FC<ArticoloFormProps> = ({articolo, onChange, immagini, categorie}) => {
  // dipendenze di tinymce
  if (typeof window !== 'undefined') {
    /* eslint-disable @typescript-eslint/no-require-imports */
    require('tinymce/tinymce');
    require('tinymce/themes/silver');
    require('tinymce/plugins/advlist');
    require('tinymce/plugins/autolink');
    require('tinymce/plugins/lists');
    require('tinymce/plugins/link');
    require('tinymce/plugins/image');
    require('tinymce/plugins/charmap');
    require('tinymce/plugins/preview');
    require('tinymce/plugins/anchor');
    require('tinymce/plugins/searchreplace');
    require('tinymce/plugins/visualblocks');
    require('tinymce/plugins/code');
    require('tinymce/plugins/fullscreen');
    require('tinymce/plugins/insertdatetime');
    require('tinymce/plugins/media');
    require('tinymce/plugins/table');
    require('tinymce/plugins/code');
    require('tinymce/plugins/help');
    require('tinymce/plugins/wordcount');

    require('tinymce/skins/ui/oxide-dark/skin');
    require('tinymce/skins/content/dark/content');
    require('tinymce/skins/ui/oxide-dark/content');

    require('tinymce/skins/ui/oxide/skin');
    require('tinymce/skins/content/default/content');
    require('tinymce/skins/ui/oxide/content');

    require('tinymce/tinymce');
    require('tinymce/models/dom/model');
    require('tinymce/themes/silver');
    require('tinymce/icons/default');
    require('tinymce/plugins/emoticons/js/emojis');
  }

  // stato generale del form
  const [formValues, setFormValues] = useState(articolo || {});
  const editorRef = useRef<EditorType>(null);

  // starter per i tag
  const tagsStarter = formValues.tags?.map((tag) => {
    return {
      value: tag,
      label: tag,
    };
  });
  const [tags, setTags] = useState<NewValue[]>(tagsStarter || []);

  // starter immagine copertina
  const immagineCopertinaStarter = {
    value: formValues.immagineCopertinaId || "",
    label: "",
  }
  immagineCopertinaStarter.label = immagini.find(img => img.id === immagineCopertinaStarter.value)?.altText || "";
  const [immagineCopertina, setImmagineCopertina] = useState<NewValue>(immagineCopertinaStarter);

  // starter categorie
  const categorieStarter = formValues.categorieId?.map((catId) => {
    const cat = categorie.find(c => c.id === catId);
    return {
      value: cat?.id || "",
      label: cat?.nome || "",
    };
  });
  const [selectedCategorie, setSelectedCategorie] = useState<NewValue[]>(categorieStarter || []);
  const categoriesOptions = categorie.map((cat) => {
    return {
      value: cat.id,
      label: cat.nome,
    };
  });

  // gestione modal selettore immagini
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageSelectorDestination, setImageSelectorDestination] = useState<SelectorDestination>(SelectorDestination.COPERTINA);
  const [modalKey, setModalKey] = useState(Math.random().toString(36).substring(7));
  const openImageModal = (dst: SelectorDestination) => {
    setModalKey(Math.random().toString(36).substring(7)); // ricarica ogni volta il componente
    setImageSelectorDestination(dst);
    setIsDialogOpen(true);
  }

  // hooks di aggiornamento esterni
  useEffect(() => {
    setFormValues(articolo || {});
  }, [articolo]);

  useEffect(() => {
    onChange(formValues);
  }, [formValues])

  // change handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const updatedData = {...formValues, [name]: value};
    setFormValues(updatedData);
    onChange(updatedData);
  };

  const handleEditorChange = (newContent: string) => {
    const updatedData = {...formValues, contenuto: newContent};
    setFormValues(updatedData);
    onChange(updatedData);
  };

  const handleImmagineSave = (img: NewValue, dst: SelectorDestination) => {
    if(dst === SelectorDestination.COPERTINA) {
      setFormValues({...formValues, immagineCopertinaId: img.value});
      setImmagineCopertina(img);
    } else {
      //TODO: implementazione da fare in base al renderer delle pagine
      editorRef.current?.execCommand('mceInsertContent', false, `[imageId: ${img.value}]`);
    }
    setIsDialogOpen(false);
    onChange(formValues);
  }

  const handleTagChange = (newValue: MultiValue<NewValue>) => {
    if(newValue) {
      const val = newValue as NewValue[];
      setTags(val);
      const updatedData = {...formValues, tags: val.map(v => v.value)};
      setFormValues(updatedData);
      onChange(updatedData);
    }
  }

  const handleCategoriaChange = (newValue: MultiValue<NewValue>) => {
    if(newValue) {
      const val = newValue as NewValue[];
      setSelectedCategorie(val);
      const updatedData = {...formValues, categorieId: val.map(v => v.value)};
      setFormValues(updatedData);
      onChange(updatedData);
    }
  }

  return (
    <section>
      <SelettoreImmaginiDialog
        isDialogOpen={isDialogOpen}
        selectorDestination={imageSelectorDestination}
        setIsDialogOpen={setIsDialogOpen}
        onSave={handleImmagineSave}
        key={modalKey}
      />
      <input
        type="hidden"
        name="contenuto"
        value={formValues.contenuto || ""}
        onChange={() => {}} // non rompere i coglioni!!! (controlled event changing an uncontrolled input)
        required
      />
      <div className="col-span-4">
        <Label htmlFor="titolo">Titolo articolo *</Label>
        <Input
          name="titolo"
          id="titolo"
          className="mb-3 mt-1"
          value={formValues.titolo || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-flow-col grid-rows-1 gap-3">
        <div className="flex gap-1">
          <div className="w-full">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              name="slug"
              id="slug"
              className="mb-3 mt-1"
              value={formValues.slug || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="">
            <Button
              variant={"outline"}
              className="mt-7"
              type="button"
              onClick={() => setFormValues({...formValues, slug: slug(formValues.titolo || "")})}
            >
              <Bot/>
              Imposta auto
            </Button>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-full">
            <Label htmlFor="immagineEvidenza">Immagine in evidenza *</Label>
            <input
              type="hidden"
              name="immagineCopertinaId"
              value={formValues.immagineCopertinaId || ""}
              required
              onChange={() => {}} // riferirsi alla bestemmia di sopra
            />
            <Input
              id="immagineEvidenza"
              className="mb-3 mt-1"
              value={immagineCopertina.label || ""}
              onChange={() => {}} // riferirsi anche qua alla bestemmia di sopra
              disabled
              required
            />
          </div>
          <div className="">
            <Button
              variant={"outline"}
              className="mt-7"
              type="button"
              onClick={() => openImageModal(SelectorDestination.COPERTINA)}
            >
              <Search/>
              Cerca
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 grid-flow-col grid-rows-1 gap-3 mb-4">
        <div className="col-span-4">
          <Label htmlFor="titolo">Categorie *</Label>
          <Select
            className="my-react-select-container col-span-3 z-30"
            classNamePrefix="my-react-select"
            options={categoriesOptions}
            value={selectedCategorie}
            name="categorieId"
            onChange={handleCategoriaChange}
            isClearable
            isMulti
          />
        </div>
        <div className="col-span-4">
          <Label htmlFor="titolo">Tags *</Label>
          <CreatableSelect
            className="my-react-select-container col-span-3 z-30"
            classNamePrefix="my-react-select"
            value={tags}
            onChange={handleTagChange}
            name="tags"
            isClearable
            isMulti
          />
        </div>
      </div>

      <Editor
        licenseKey="gpl"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={formValues.contenuto}

        onChange={() => {}} // riferirsi alla bestemmia di sopra
        init={{
          height: 500,
          menubar: true,
          skin: 'oxide',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview', 'anchor',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | image',
          setup: (editor) => {
            editor.ui.registry.addButton('image', {
              icon: 'image',
              tooltip: 'Insert image',
              onAction: () => openImageModal(SelectorDestination.TINYMCE),
            });
          },
        }}
        onEditorChange={handleEditorChange}
      />

    </section>
  );

}

export default ArticoloForm;