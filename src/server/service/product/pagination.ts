import { and, asc, count, desc, ilike } from "drizzle-orm"
import { unstable_cache } from "next/cache"

import { db } from "../../db"

import { productsSchema } from "../../schema/product"

import { PRODUCT_CACHE_KEY } from "@/constants/keys/cache"
import { PRODUCT_CACHE_TIME } from "@/config/app"

import type { Pagination, Sort } from "../../types/table"
import type { Product } from "../../types/product"

export type PartialProduct = Omit<Product, "description">
export type ProductKeys = keyof PartialProduct
export type ProductSortColumns = Sort<ProductKeys>
export type ProductFilter = {
    column: ProductKeys
    value: string
}

export function isProductKey(key: string): key is ProductKeys {
    // Todo refactor, avoid redundancy
    return ["id", "title", "created", "price"].includes(key)
}

interface GetProductsWithPagination {
    filters?: ProductFilter[]
    sort?: ProductSortColumns
    pagination: Pagination
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
