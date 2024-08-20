import { eq } from "drizzle-orm"

import { db } from "../db"

import { users } from "../schema"

import type { InsertUser } from "../types/user"

export type CreateUserData = Pick<InsertUser, "name" | "email" | "password">

export async function createUser(userData: CreateUserData): Promise<string> {
    const { name, email, password } = userData

    const createdUser = await db
        .insert(users)
        .values({
            name,
            email,
            password,
        })
        .returning({ id: users.id })

    return createdUser[0].id
}

export async function findUserByEmail(
    email: string
): Promise<InsertUser | undefined> {
    return await db.query.users.findFirst({
        where: eq(users.email, email),
    })
}
