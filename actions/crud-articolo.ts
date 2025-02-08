"use server"
import {Prisma, PrismaClient, TipoSocio} from "@prisma/client";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function crudArticoloAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== TipoSocio.ADMIN) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  // parametri base
  const objectId = formData.get('objectId') as string
  const action = formData.get('action') as string

  // parametri socio obbligatori
  const titolo = formData.get('titolo') as string
  const slug = formData.get('slug') as string
  const contenuto = formData.get('contenuto') as string
  const tags = formData.getAll('tags') as string[]
  const immagineCopertinaId = formData.get('immagineCopertinaId') as string
  const categorieId = formData.getAll('categorieId') as string[]

  if(action === 'create' || action === 'update') {
    if(
      !action                   ||
      !titolo                   ||
      !slug                     ||
      !contenuto                ||
      !tags                     ||
      tags.length < 1           ||
      !immagineCopertinaId      ||
      !categorieId              ||
      categorieId.length < 1
    ) {
      return {success: false, message: 'Dati form non validi'}
    }
  }

  const dbData: Prisma.ArticoloCreateInput = {
    titolo,
    slug,
    contenuto,
    tags,
    immagineCopertina: {
      connect: {
        id: immagineCopertinaId
      }
    },
    categorie: {
      connect: categorieId.map(id => ({id}))
    },
  }

  if(action === 'create') {
    try{
      await prisma.articolo.create({
        data: {
          ...dbData,
          pubblicato: false
        }
      });

      console.log('Articolo creato con successo,', dbData)
    } catch (e) {
      return {success: false, message: 'Errore durante la creazione dell\'articolo: ' + e}
    }

    redirect('/dashboard/articoli') // pagina diversa quindi redirect
  } else if (action === 'update') {
    if(!objectId) {
      return {success: false, message: 'ObjectId non valido'}
    }

    try{
      await prisma.articolo.update({
        data: dbData,
        where: {
          id: objectId
        }
      });
    } catch (e) {
      return {success: false, message: 'Errore durante la modifica dell\'articolo: ' + e}
    }

    redirect('/dashboard/articoli') // pagina diversa quindi redirect
  } else if (action === 'remove') {
    if (!objectId) {
      return {success: false, message: 'ObjectId non valido'}
    }

    try{
      await prisma.articolo.delete({
        where: {
          id: objectId
        }
      });
    } catch (e) {
      return {success: false, message: 'Errore durante l\'eliminazione dell\'articolo: ' + e}
    }

    return {success: true, message: ''}
  } else {
    return {success: false, message: 'Azione non valida'}
  }
}