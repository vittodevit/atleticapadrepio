import NextAuth, {type DefaultSession} from "next-auth";
import Credentials from "next-auth/providers/credentials"
import {compareSync} from "bcrypt-ts";
import {PrismaClient, TipoSocio} from "@prisma/client";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface User {
    dbId: string;
    role: TipoSocio;
  }

  interface Session {
    user: {
      dbId: string;
      role: TipoSocio;
    } & DefaultSession["user"]
  }

  interface JWT {
    dbId: string;
    role: TipoSocio;
  }
}

export async function getSocioByEmail(email: string) {
  return prisma.socio.findUnique({
    where: {
      email,
    },
  });
}

export const {handlers, signIn, signOut, auth} = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let utente = null;
        try {
          utente = await getSocioByEmail(credentials.email as string);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (ignored) {
          return null;
        }

        if (!utente) {
          return null;
        }

        if (!compareSync(credentials.password as string, utente.passwordHash)) {
          return null;
        }

        return {
          dbId: utente.id,
          name: utente.nome + " " + utente.cognome,
          email: utente.email,
          role: utente.tipoSocio,
        };
      },
    }),
  ],
  callbacks: {
    // ho tolto user dai parametri x eslint se esplode tutto rimetti!
    session({session, token}) {
      session.user.dbId = token.dbId as string;
      session.user.role = token.role as TipoSocio;
      return session;
    },
    async jwt({token, user}) {
      if (user) {
        token.dbId = user.dbId;
        token.role = user.role;
      }
      return token;
    },
  },
});
