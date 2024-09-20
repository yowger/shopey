"use server"

import { createId } from "@paralleldrive/cuid2"
import { revalidateTag } from "next/cache"

import { actionClient } from "@/lib/safe-action/public"

import { CreateProductSchema } from "@/app/dashboard/products/_schemas/product"

import { createProduct } from "@/server/service/product"

import { InternalServerError } from "@/errors/http"

import { PRODUCT_CACHE_KEY } from "@/constants/keys/cache"

export const createProductAction = actionClient
    .schema(CreateProductSchema)
    .action(async (params) => {
        const { parsedInput } = params

        try {
            const createdProduct = await createProduct(parsedInput)

            revalidateTag(PRODUCT_CACHE_KEY)

            return {
                success: `Product ${createdProduct.title} created successfully.`,
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
