import { eq } from "drizzle-orm"

import { db } from "../db"

import { usersSchema } from "../schema/user"

import type { User } from "../types/user"

export type UserInput = Pick<User, "name" | "email" | "password">

export async function createUser(
    userInput: UserInput
): Promise<{ id: string }> {
    const { name, email, password } = userInput

    const [createdUser] = await db
        .insert(usersSchema)
        .values({
            name,
            email: email.toLocaleLowerCase(),
            password,
        })
        .returning({ id: usersSchema.id })

    return createdUser
}

export async function findUserByEmail(
    email: string
): Promise<User | undefined> {
    return await db.query.usersSchema.findFirst({
        where: eq(usersSchema.email, email.toLocaleLowerCase()),
    })
}
