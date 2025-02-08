"use server"
import {auth} from "@/auth";
import {PrismaClient, TipoSocio} from "@prisma/client";

const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function editImageAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== TipoSocio.ADMIN) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  const paramId = formData.get('paramId') as string
  const altText = formData.get('altText') as string
  const includeInGallery = formData.get('includeInGallery') as string
  const includeInSponsor = formData.get('includeInSponsor') as string

  if(!altText || !paramId) {
    return {message: 'Dati form non validi'}
  }

  await prisma.immagine.update(
    {
      where: {
        id: paramId
      },
      data: {
        altText: altText,
        includeInGallery: includeInGallery === 'true',
        includeInSponsor: includeInSponsor === 'true'
      }
    }
  )

  return {message: 'success'}
}