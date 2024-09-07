import { eq } from "drizzle-orm"
import { unstable_cache } from "next/cache"

import { db } from "../../db"

import { productsSchema } from "../../schema/product"

import { PRODUCT_CACHE_KEY } from "@/constants/keys/cache"
import { PRODUCT_CACHE_TIME } from "@/config/app"

import type { Product } from "../../types/product"

export const getProductById = async (
    productId: number
): Promise<Product | null> => {
    const [product] = await db
        .select()
        .from(productsSchema)
        .where(eq(productsSchema.id, productId))

    return product || null
}

export async function getCachedProductById(productId: number) {
    const CACHED_KEY = `${PRODUCT_CACHE_KEY}:${productId}`

    const getProduct = unstable_cache(
        async (productId) => await getProductById(productId),
        [CACHED_KEY],
        {
            revalidate: PRODUCT_CACHE_TIME,
            tags: [PRODUCT_CACHE_KEY],
        }
    )

    return await getProduct(productId)
}

export type ProductInput = Omit<Product, "id" | "created" | "updated">

export const createProduct = async (
    productInput: ProductInput
): Promise<number> => {
    const [createdProduct] = await db
        .insert(productsSchema)
        .values(productInput)
        .returning({ createdId: productsSchema.id })

    return createdProduct.createdId
}

export const updateProduct = async (
    productId: number,
    productInput: ProductInput
): Promise<number> => {
    const [updatedProduct] = await db
        .update(productsSchema)
        .set(productInput)
        .where(eq(productsSchema.id, productId))
        .returning({ updatedId: productsSchema.id })

    return updatedProduct.updatedId
}
