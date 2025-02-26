"use server";
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchArticles(page: number = 1, limit: number = 10) {
  return prisma.articolo.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      titolo: true,
      slug: true,
      pubblicato: true,
      updatedAt: true,
      categorie: {
        select: {
          nome: true,
        },
      },
      immagineCopertina : {
        select: {
          id: true,
          altText: true,
        }
      },
      contenuto: true,
    },
    where: {
      pubblicato: true,
    }
  });
}