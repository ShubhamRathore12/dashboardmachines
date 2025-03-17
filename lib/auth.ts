import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const config = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.email === "shub@gmail.com" && 
          credentials?.password === "1234"
        ) {
          return {
            id: "1",
            email: "shub@gmail.com",
            name: "Shub"
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  }
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
export const { GET, POST } = NextAuth(config).handlers;