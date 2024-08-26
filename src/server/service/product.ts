import { count } from "drizzle-orm"

import { db } from "../db"

import { productsSchema } from "../schema/product"

import type { Product } from "../types/product"

interface GetProductsWithPagination {
    page?: number
    limit?: number
}

export async function getProductsWithPagination(
    params: GetProductsWithPagination
) {
    const { page = 1, limit = 10 } = params

    const offset = (page - 1) * limit

    const [products, totalProducts] = await Promise.all([
        db.select().from(productsSchema).offset(offset).limit(limit),
        db.select({ count: count() }).from(productsSchema),
    ])

    const total = totalProducts[0].count ?? 0

    return {
        products,
        total,
        page,
        limit,
    }
}

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
