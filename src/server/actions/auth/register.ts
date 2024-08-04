"use server"

import bcrpyt from "bcrypt"
import { eq } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { db } from "@/server/db"

import { actionClient } from "@/lib/safeAction"

import { RegisterSchema } from "@/schemas/auth/register"
import { users } from "@/server/schema"

import { REGISTER_ERROR } from "./types"

export const register = actionClient
    .schema(RegisterSchema, {
        handleValidationErrorsShape: (validationErrors) =>
            flattenValidationErrors(validationErrors).fieldErrors,
    })
    .action(async ({ parsedInput }) => {
        const { name, email, password } = parsedInput

        const saltRounds = 10
        const hashedPassword = await bcrpyt.hash(password, saltRounds)

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        })

        if (existingUser) {
            return {
                failure: "Email already in use.",
                code: REGISTER_ERROR.USER_EXISTS,
            }
        }

        try {
            await db
                .insert(users)
                .values({ name, email, password: hashedPassword })
        } catch (error) {
            console.error("error user registration:", error)

            return {
                failure: "An error occurred during registration.",
                code: REGISTER_ERROR.REGISTRATION_ERROR,
            }
        }

        // TODO: otp code

        return {
            success: "OTP code has been sent to your email",
        }
    })
