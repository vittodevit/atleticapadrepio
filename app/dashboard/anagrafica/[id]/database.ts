import { PrismaClient, Socio } from '@prisma/client';

const prisma = new PrismaClient();

export async function getSocioById(id: string): Promise<Partial<Socio>> {

  const socio = await prisma.socio.findUnique({
    where: {
      id: id,
    },
  });

  if (!socio) {
    throw new Error('Socio non trovato');
  }

  return socio!;

}