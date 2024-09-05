import { and, asc, count, desc, eq, ilike } from "drizzle-orm"
import { unstable_cache } from "next/cache"

import { db } from "../db"

import { productsSchema } from "../schema/product"

import { PRODUCT_CACHE_KEY } from "@/constants/keys/cache"
import { PRODUCT_CACHE_TIME } from "@/config/app"

import type { Pagination, Sort } from "../types/table"
import type { Product } from "../types/product"

export type PartialProduct = Omit<Product, "description">
export type ProductKeys = keyof PartialProduct
export type ProductSortColumns = Sort<ProductKeys>
export type ProductFilter = {
    column: ProductKeys
    value: string
}

interface GetProductsWithPagination {
    filters?: ProductFilter[]
    sort?: ProductSortColumns
    pagination: Pagination
}

export function isProductKey(key: string): key is ProductKeys {
    // Todo refactor, avoid redundancy
    return ["id", "title", "created", "price"].includes(key)
}

export const getProductsWithPagination = async (
    params: GetProductsWithPagination
) => {
    const { filters, pagination, sort } = params
    const { page = 1, limit = 10 } = pagination
    const offset = (page - 1) * limit

    const defaultSortClause = desc(productsSchema.created)

    const filterConditions = filters ? buildFilterClause(filters) : []
    const sortByClause = sort ? buildSortClause(sort) : defaultSortClause

    let totalProductsQuery = db
        .select({ count: count() })
        .from(productsSchema)
        .$dynamic()

    let productQuery = db
        .select({
            id: productsSchema.id,
            title: productsSchema.title,
            price: productsSchema.price,
            created: productsSchema.created,
            updated: productsSchema.updated,
        })
        .from(productsSchema)
        .orderBy(sortByClause)
        .offset(offset)
        .limit(limit)
        .$dynamic()

    if (filterConditions.length > 0) {
        productQuery = productQuery.where(and(...filterConditions))
        totalProductsQuery = totalProductsQuery.where(and(...filterConditions))
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

export async function getCachedProductsWithPagination(
    params: GetProductsWithPagination
) {
    const CACHED_KEY = `${PRODUCT_CACHE_KEY}:pagination:${JSON.stringify(
        params
    )}`

    const getProducts = unstable_cache(
        async (params) => await getProductsWithPagination(params),
        [CACHED_KEY],
        {
            revalidate: PRODUCT_CACHE_TIME,
            tags: [PRODUCT_CACHE_KEY],
        }
    )

    return await getProducts(params)
}

const buildFilterClause = (filters: ProductFilter[]) => {
    return filters.map((filter) =>
        ilike(productsSchema[filter.column], `%${filter.value}%`)
    )
}

const buildSortClause = (sort: ProductSortColumns) => {
    return sort.order === "desc"
        ? desc(productsSchema[sort.column])
        : asc(productsSchema[sort.column])
}

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
