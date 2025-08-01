import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { authSchema } from "./lib/zod"
import { prisma } from "./prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = await authSchema.parseAsync(credentials)
        if (!email || !password) {
          throw new Error("Please enter the credentials")
        }
        const user = await prisma.user.findUnique({
          where: {
            email
          }, include: {
            accounts: true
          }
        })

        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10)
          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashedPassword
            },
          })
          return {
            id: newUser.id,
            email: newUser.email
          }
        }
        if (!user.password) {
          throw new Error(`Account exists via ${user.accounts?.[0]?.provider || "another provider"}.`)
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
          throw new Error("Invalid Password")
        }
        return {
          id: user.id,
          email: user.email
        }
      }
    }),
    Google,
    GitHub,
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
      }
      return session;
    }
  }
})