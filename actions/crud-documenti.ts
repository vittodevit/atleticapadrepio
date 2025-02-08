"use server"
import {PrismaClient, TipoSocio} from "@prisma/client";
import {auth} from "@/auth";
import {ObjectId} from "mongodb";
import {saveGenericFile} from "@/lib/gridfs";
const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function crudDocumentiAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== TipoSocio.ADMIN) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  // parametri base
  const objectId = formData.get('objectId') as string
  const action = formData.get('action') as string

  // parametri socio obbligatori
  const titolo = formData.get('titolo') as string
  const document = formData.get('document') as File
  const tipoSociDestinatari = formData.getAll('tipoSociDestinatari') as TipoSocio[]

  // parametri socio opzionali
  const descrizione = formData.get('descrizione') as string

  if(action === 'create' || action === 'update') {
    if(!action || !titolo || !tipoSociDestinatari) {
      return {message: 'Dati form non validi'}
    }
  }

  if(action === 'create' && !document) {
    return {message: 'Documento non caricato'}
  }

  // force all documents to be visible to admins
  if(!tipoSociDestinatari.includes(TipoSocio.ADMIN)) {
    tipoSociDestinatari.push(TipoSocio.ADMIN)
  }

  const dbData = {
    titolo,
    descrizione,
    tipoSociDestinatari: {
      set: tipoSociDestinatari
    },
  }

  if(action === 'create') {

    // tenta upload su gridfs
    let fileId: ObjectId;
    try {
      fileId = await saveGenericFile(document);
    } catch (error) {
      return {message: 'Errore durante il caricamento dell\'immagine: ' + error}
    }

    try {
      await prisma.documento.create(
        {
          data: {
            ...dbData,
            mimeType: document.type,
            objectId: fileId.toHexString()
          }
        }
      )
    } catch (error) {
      return {message: 'Errore durante la creazione del documento: ' + error}
    }

    return {message: "success"}
  } else if (action === 'update') {
    if(!objectId) {
      return {message: 'ObjectId non valido'}
    }

    try {
      await prisma.documento.update(
        {
          data: {
            ...dbData,
          },
          where: {
            id: objectId
          }
        }
      )
    } catch (error) {
      return {message: 'Errore durante l\'aggiornamento del documento: ' + error}
    }

    return {message: "success"}
  } else if (action === 'remove') {
    if (!objectId) {
      return {message: 'ObjectId non valido'}
    }

    try {
      await prisma.documento.delete({
        where: {
          id: objectId
        }
      })
    } catch (error) {
      return {message: 'Errore durante la rimozione del documento: ' + error}
    }

    return {message: "success"}
  } else {
    return {message: 'Azione non valida'}
  }
}