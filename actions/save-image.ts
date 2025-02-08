"use server"
import {auth} from "@/auth";
import {PrismaClient, TipoSocio} from "@prisma/client";
import {saveImage} from "@/lib/gridfs";
import {ObjectId} from "mongodb";

const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function saveImageAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== TipoSocio.ADMIN) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  const imageFile = formData.get('imageFile') as File
  const altText = formData.get('altText') as string
  const includeInGallery = formData.get('includeInGallery') as string
  const includeInSponsor = formData.get('includeInSponsor') as string

  if(!imageFile || !altText) {
    return {message: 'Dati form non validi'}
  }

  let fileId: ObjectId;
  try {
    fileId = await saveImage(imageFile);
  } catch (error) {
    return {message: 'Errore durante il caricamento dell\'immagine: ' + error}
  }

  await prisma.immagine.create(
    {
      data: {
        altText: altText,
        objectId: fileId.toHexString(),
        includeInGallery: includeInGallery === 'true',
        includeInSponsor: includeInSponsor === 'true'
      }
    }
  )

  return {message: 'success'}
}