"use server"

import { actionClient } from "@/lib/safeAction"

import { findUserByEmail } from "@/server/service/user"
import { signIn } from "@/server/auth"

import { LoginSchema } from "@/schemas/auth/login"

import {
    BadRequestError,
    BaseError,
    ConflictError,
    InternalServerError,
    NotFoundError,
} from "@/errors/http"

export const login = actionClient
    .schema(LoginSchema)
    .action(async ({ parsedInput }) => {
        const { email, password } = parsedInput

        const user = await findUserByEmail(email)

        if (!user) {
            throw new NotFoundError("Email not registered.")
        }

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password: password,
            })

            console.log("cool result ", result)
            if (result) {
            }

            return { success: "Successfully signed in." }
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === "CredentialsSignin") {
                    throw new BadRequestError("Invalid credentials")
                }
            }

            throw new InternalServerError()
        }
    })
