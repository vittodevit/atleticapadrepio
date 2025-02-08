"use server"
import {PrismaClient, TipoSocio} from "@prisma/client";
import {auth} from "@/auth";
import { genSaltSync, hashSync } from "bcrypt-ts";
import generator from 'generate-password';
import {redirect} from "next/navigation";

const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function crudSocioAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== TipoSocio.ADMIN) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  // parametri base
  const objectId = formData.get('objectId') as string
  const action = formData.get('action') as string

  // parametri socio obbligatori
  const nome = formData.get('nome') as string
  const cognome = formData.get('cognome') as string
  const email = formData.get('email') as string
  const codiceFiscale = formData.get('codiceFiscale') as string
  const dataNascita = formData.get('dataNascita') as string
  const tipoSocio = formData.get('tipoSocio') as string

  // parametri socio opzionali
  const numeroTelefono = formData.get('numeroTelefono') as string
  const luogoNascita = formData.get('luogoNascita') as string
  const luogoResidenza = formData.get('luogoResidenza') as string
  const indirizzo = formData.get('indirizzo') as string
  const cap = formData.get('cap') as string
  const provincia = formData.get('provincia') as string

  if(action === 'create' || action === 'update') {
    if(!action || !nome || !cognome || !email || !codiceFiscale || !dataNascita || !tipoSocio) {
      return {success: false, message: 'Dati form non validi'}
    }
  }

  const dbData = {
    nome,
    cognome,
    email,
    codiceFiscale,
    dataNascita: new Date(dataNascita),
    tipoSocio: tipoSocio as TipoSocio,
    numeroTelefono,
    luogoNascita,
    luogoResidenza,
    indirizzo,
    cap,
    provincia,
  }

  if(action === 'create') {
    const nuovaPassword = generator.generate({
      length: 12,
      numbers: true
    });
    const hash = hashSync(nuovaPassword, genSaltSync(10)); // Store hash in your password DB.

    try {
      await prisma.socio.create({
        data: {
          ...dbData,
          passwordHash: hash
        }
      })
    } catch (error) {
      return {success: false, message: 'Errore durante la creazione del socio ' + error}
    }

    return {success: true, message: nuovaPassword}
  } else if (action === 'update') {
    if(!objectId) {
      return {success: false, message: 'ObjectId non valido'}
    }

    try {
      await prisma.socio.update({
        where: {id: objectId},
        data: dbData
      })
    } catch (error) {
      return {success: false, message: 'Errore durante l\'aggiornamento del socio ' + error}
    }

    redirect('/dashboard/anagrafica') // pagina diversa quindi redirect
  } else if (action === 'remove') {
    if (!objectId) {
      return {success: false, message: 'ObjectId non valido'}
    }

    try {
      await prisma.socio.delete({
        where: {id: objectId}
      })
    } catch (error) {
      return {success: false, message: 'Errore durante l\'eliminazione del socio ' + error}
    }

    return {success: true, message: ''}
  } else {
    return {success: false, message: 'Azione non valida'}
  }
}