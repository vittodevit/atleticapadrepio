"use server"
import {auth} from "@/auth";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

// prevState needs to be there to match the method signature expected by the client, but it's not used
// eslint-disable-next-line
export default async function selfAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session) {
    return {message: 'Sessione non valida, riautenticarsi'}
  }

  const socio = await prisma.socio.findUnique({
    where: {
      id: session.user.dbId
    }
  });

  return {message: 'success', user: socio}
}