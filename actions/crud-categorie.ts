"use server"
import {PrismaClient, TipoSocio} from "@prisma/client";
import {auth} from "@/auth";
const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function crudCategorieAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== TipoSocio.ADMIN) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  // parametri base
  const objectId = formData.get('objectId') as string
  const action = formData.get('action') as string

  // parametri socio obbligatori
  const nome = formData.get('nome') as string
  const slug = formData.get('slug') as string

  // parametri socio opzionali
  const descrizione = formData.get('descrizione') as string

  if(action === 'create' || action === 'update') {
    if(!action || !nome || !slug) {
      return {message: 'Dati form non validi'}
    }
  }

  const dbData = {
    nome,
    slug,
    descrizione
  }

  if(action === 'create') {
    try {
      await prisma.categoria.create({
        data: dbData
      })
    } catch (error) {
      return {message: 'Errore durante la creazione della categoria ' + error}
    }

    return {message: "success"}
  } else if (action === 'update') {
    if(!objectId) {
      return {message: 'ObjectId non valido'}
    }

    try {
      await prisma.categoria.update({
        where: {id: objectId},
        data: dbData
      })
    } catch (error) {
      return {message: 'Errore durante l\'aggiornamento della categoria ' + error}
    }

    return {message: "success"}
  } else if (action === 'remove') {
    if (!objectId) {
      return {message: 'ObjectId non valido'}
    }

    try {
      await prisma.categoria.delete({
        where: {id: objectId}
      })
    } catch (error) {
      return {message: 'Errore durante l\'eliminazione della categoria ' + error}
    }

    return {message: "success"}
  } else {
    return {message: 'Azione non valida'}
  }
}