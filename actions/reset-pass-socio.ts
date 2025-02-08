"use server"
import {PrismaClient, TipoSocio} from "@prisma/client";
import {auth} from "@/auth";
import { genSaltSync, hashSync } from "bcrypt-ts";
import generator from 'generate-password';

const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function resetPasswordSocioAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== TipoSocio.ADMIN) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  // parametri base
  const objectId = formData.get('objectId') as string

  if(!objectId) {
    return {success: false, message: 'ObjectId non valido'}
  }

  const nuovaPassword = generator.generate({
    length: 12,
    numbers: true
  });
  const hash = hashSync(nuovaPassword, genSaltSync(10));

  try {
    await prisma.socio.update({
      where: {id: objectId},
      data: {
        passwordHash: hash
      }
    })
  } catch (error) {
    return {success: false, message: 'Errore durante il cambio password ' + error}
  }

  return {success: true, message: nuovaPassword}
}