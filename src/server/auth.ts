import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
// import GoogleProvider from "next-auth/providers/google"

import { db } from "./db"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import env from "@/config/env/server"

import type { NextAuthConfig } from "next-auth"
import { findUserByEmail } from "@/server/service/user"

const config = {
    adapter: DrizzleAdapter(db),
    session: { strategy: "jwt" },
    secret: env.AUTH_SECRET,
    providers: [
        Credentials({
            name: "Credentials",
            authorize: async (credentials) => {
                const { email, password } = credentials as {
                    email: string
                    password: string
                }

                const user = await findUserByEmail(email)
                if (!user) {
                    return null
                }

                const isValidPassword = await bcrypt.compare(
                    password,
                    user.password
                )
                if (!isValidPassword) {
                    return null
                }

                return user
            },
        }),
        Github({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
        // Google({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),
    ],
    callbacks: {
        async session(args) {
            const { session } = args

            return session
        },
        async jwt(args) {
            const { token } = args

            return token
        },
    },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
