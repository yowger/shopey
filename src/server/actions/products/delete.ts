"use server"

import { createId } from "@paralleldrive/cuid2"
import { revalidatePath, revalidateTag } from "next/cache"

import { actionClient } from "@/lib/safe-action/public"

import { DeleteProductSchema } from "@/schemas/product"

import { deleteProductById } from "@/server/service/product"

import { PRODUCT_CACHE_KEY } from "@/constants/keys/cache"

import { InternalServerError } from "@/errors/http"

export const deleteProductAction = actionClient
    .schema(DeleteProductSchema)
    .action(async (params) => {
        const { parsedInput } = params
        const { id } = parsedInput

        try {
            const deletedProductId = await deleteProductById(id)

            revalidateTag(PRODUCT_CACHE_KEY)

            return {
                success: `Product ${deletedProductId} deleted successfully.`,
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
