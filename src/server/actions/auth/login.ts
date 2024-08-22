"use server"

import { AuthError } from "next-auth"
import { createId } from "@paralleldrive/cuid2"

import { actionClient } from "@/lib/safeAction"

import { signIn } from "@/server/auth"

import { LoginSchema } from "@/schemas/auth/login"

import {
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from "@/errors/http"

export const login = actionClient
    .schema(LoginSchema)
    .action(async ({ parsedInput }) => {
        const { email, password } = parsedInput

        try {
            await signIn("credentials", {
                redirect: false,
                email,
                password: password,
            })

            return { success: "Successfully signed in." }
        } catch (error: unknown) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CallbackRouteError":
                        const cause = error.cause?.err

                        if (cause instanceof NotFoundError) {
                            throw new NotFoundError({
                                id: createId(),
                                description: cause.message,
                            })
                        } else if (cause instanceof UnauthorizedError) {
                            throw new UnauthorizedError({
                                id: createId(),
                                description: cause.message,
                            })
                        }

                        break
                }
            }

            if (error instanceof Error) {
                throw new InternalServerError({
                    id: createId(),
                    description: error.message,
                })
            }
        }
    })
