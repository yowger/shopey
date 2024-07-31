import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
// import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"

import { db } from "./db"

import env from "@/config/env/server"

import type { NextAuthConfig } from "next-auth"

const config = {
    adapter: DrizzleAdapter(db),
    session: { strategy: "jwt" },
    providers: [
        Github({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
        // Google({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),
    ],
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
