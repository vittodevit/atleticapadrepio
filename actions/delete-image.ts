"use server"
import {auth} from "@/auth";
import {PrismaClient, TipoSocio} from "@prisma/client";
import {deleteFile} from "@/lib/gridfs";

const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function deleteImageAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== TipoSocio.ADMIN) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  const paramId = formData.get('paramId') as string

  if(!paramId) {
    return {message: 'Dati form non validi'}
  }

  // search the image in the db
  const image = await prisma.immagine.findUnique({
    where: {
      id: paramId
    }
  })

  if(!image) {
    return {message: 'Immagine non trovata'}
  }

  try {
    await deleteFile(image.objectId) // gridfs
    await prisma.immagine.delete({ // database
      where: {
        id: image.id
      }
    })
  } catch (error) {
    return {message: 'Errore durante la cancellazione del file: ' + error}
  }

  return {message: 'success'}
}