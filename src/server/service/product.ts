import { asc, count, desc } from "drizzle-orm"

import { db } from "../db"

import { productsSchema } from "../schema/product"

import type { Pagination, Sort } from "../types/table"
import type { Product } from "../types/product"

export type PartialProduct = Omit<Product, "description">
export type ProductKeys = keyof PartialProduct
export type ProductSortColumns = Sort<ProductKeys>

interface GetProductsWithPagination {
    pagination: Pagination
    sort?: ProductSortColumns | undefined
}

export function isProductKey(key: string): key is ProductKeys {
    // Todo refactor, avoid redundancy
    return ["id", "title", "created", "price"].includes(key)
}

export async function getProductsWithPagination(
    params: GetProductsWithPagination
) {
    const { pagination, sort } = params
    const { page = 1, limit = 10 } = pagination

    const offset = (page - 1) * limit
    const totalProductsQuery = db
        .select({ count: count() })
        .from(productsSchema)

    let productQuery = db
        .select()
        .from(productsSchema)
        .offset(offset)
        .limit(limit)
        .$dynamic()

    if (sort) {
        const sortByClause =
            sort.order === "desc"
                ? desc(productsSchema[sort.column])
                : asc(productsSchema[sort.column])

        productQuery = productQuery.orderBy(sortByClause)
    }

    const [products, totalProducts] = await Promise.all([
        productQuery,
        totalProductsQuery,
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
