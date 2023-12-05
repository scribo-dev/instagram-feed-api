import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import * as bcrypt from "bcrypt";

import type { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & { id: string };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = { ...user };
      }
      return token;
    },
    session({ session, token }) {
      if (token?.user) {
        //@ts-ignore
        session.user = token.user;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jane@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            image: true,
          },
        });
        if (!user || !user.password) return null;
        const passwordChecked = await bcrypt.compare(password, user?.password);

        if (user && passwordChecked) {
          user.password = null;
          return user;
        }
        return null;
      },
    }),
  ],
};
