"use server"

import { AuthError } from "next-auth"
import { createId } from "@paralleldrive/cuid2"

// import { signIn } from "@/server/auth"

import { ProductSchema } from "@/schemas/product/add"

import { InternalServerError } from "@/errors/http"
import { actionClient } from "@/lib/safe-action/public"

export const addProduct = actionClient
    .schema(ProductSchema)
    .action(async ({ parsedInput }) => {
        const { id, title, description, price } = parsedInput

        try {
            // return { success: "Successfully signed in." }
        } catch (error: unknown) {
            // if (error instanceof AuthError) {
            //     switch (error.type) {
            //     }
            // }

            if (error instanceof Error) {
                throw new InternalServerError({
                    id: createId(),
                    description: error.message,
                })
            }
        }
    })
