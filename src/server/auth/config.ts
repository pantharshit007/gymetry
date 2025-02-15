import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// eslint-disable-next-line import/no-unresolved
import { JWT } from "next-auth/jwt";

import { db } from "@/server/db";
import { env } from "@/env";
import { Role } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      role: Role;
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/error",
  },

  events: {
    createUser: async ({ user }) => {
      if (user && user.id) {
        await db.streak.create({
          data: {
            userId: user.id,
            current_streak: 0,
            longest_streak: 0,
            last_log_date: new Date(),
          },
        });
      }
    },
  },

  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role as Role;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },

  secret: env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 15 * 24 * 60 * 60, // 15 days
  },
} satisfies NextAuthConfig;
