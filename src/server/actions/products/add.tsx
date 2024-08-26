"use server"

import { AuthError } from "next-auth"
import { createId } from "@paralleldrive/cuid2"

// import { signIn } from "@/server/auth"

import { CreateProductSchema } from "@/schemas/product/add"

import { InternalServerError } from "@/errors/http"
import { actionClient } from "@/lib/safe-action/public"
import { createProduct } from "@/server/service/product"

export const addProduct = actionClient
    .schema(CreateProductSchema)
    .action(async ({ parsedInput }) => {
        const { title, description, price } = parsedInput

        try {
            const createdProduct = await createProduct({
                title,
                description,
                price,
            })

            return {
                success: `Product "${createdProduct.title}" created successfully.`,
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new InternalServerError({
                    id: createId(),
                    description: error.message,
                })
            }
        }
    })
