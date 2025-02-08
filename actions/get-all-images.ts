"use server"
import {auth} from "@/auth";
import {PrismaClient, TipoSocio} from "@prisma/client";

const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function getAllImagesAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== TipoSocio.ADMIN) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  const images = await prisma.immagine.findMany()
  return {message: 'success', images: images}
}