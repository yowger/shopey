import NextAuth from "next-auth"

import type { DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    sub: string
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}
