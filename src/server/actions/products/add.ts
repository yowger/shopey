"use server"

import { createId } from "@paralleldrive/cuid2"

import { actionClient } from "@/lib/safe-action/public"

import { CreateProductSchema } from "@/schemas/product/add"

import { createProduct } from "@/server/service/product"

import { InternalServerError } from "@/errors/http"

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
