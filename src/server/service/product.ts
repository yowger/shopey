import { db } from "../db"

import { productsSchema } from "../schema/product"

import type { Product } from "../types/product"

export type ProductInput = Omit<Product, "id" | "created">

export async function createProduct(
    productInput: ProductInput
): Promise<Product> {
    const { title, description, price } = productInput

    const [createdProduct] = await db
        .insert(productsSchema)
        .values({
            title,
            description,
            price,
        })
        .returning()

    return createdProduct
}
