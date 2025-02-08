"use server"
import {auth} from "@/auth";
import {PrismaClient} from "@prisma/client";
import {compareSync, hashSync} from "bcrypt-ts";

const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function changePasswordSelfAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  const socio = await prisma.socio.findUnique({
    where: {
      id: session.user.dbId
    }
  });

  if (!socio) {
    return {message: 'Socio non trovato'}
  }

  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('newPassword') as string
  const newPasswordConfirm = formData.get('confirmPassword') as string

  if (!oldPassword || !newPassword || !newPasswordConfirm) {
    return {message: 'Dati form non validi'}
  }

  if (newPassword !== newPasswordConfirm) {
    return {message: 'Le nuove password non corrispondono'}
  }

  if(!compareSync(oldPassword, socio.passwordHash)) {
    return {message: 'La vecchia password non è corretta'}
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{10,}$/.test(newPassword)) {
    return {message: 'La password deve contenere almeno 10 caratteri, di cui almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale'}
  }

  const passwordHash = hashSync(newPassword, 10);

  try {
    await prisma.socio.update({
      where: {
        id: session.user.dbId
      },
      data: {
        passwordHash
      }
    });
  }catch (e) {
    return {message: 'Errore durante l\'aggiornamento della password: ' + e}
  }

  return {message: 'success'}
}