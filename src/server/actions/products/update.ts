"use server"

import { createId } from "@paralleldrive/cuid2"
import { revalidatePath, revalidateTag } from "next/cache"

import { actionClient } from "@/lib/safe-action/public"

import { UpdateProductSchema } from "@/schemas/product"

import { updateProduct } from "@/server/service/product"

import { PRODUCT_CACHE_KEY } from "@/constants/keys/cache"

import { InternalServerError } from "@/errors/http"

export const updateProductAction = actionClient
    .schema(UpdateProductSchema)
    .action(async (params) => {
        const { parsedInput } = params
        const { id, ...restProductInput } = parsedInput

        try {
            const updatedProductId = await updateProduct(id, restProductInput)

            revalidateTag(PRODUCT_CACHE_KEY)

            return {
                success: `Product ${updatedProductId} updated successfully.`,
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
