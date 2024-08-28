import { Suspense } from "react"

import {
    getProductsWithPagination,
    isProductKey,
    ProductSortColumns,
} from "@/server/service/product"

import { PAGE_SIZES } from "@/config/tables"

import { validatePageSize } from "@/utils/table/index"

import { ProductDataTable } from "@/components/data-tables/product"
import { columns } from "@/components/data-tables/product/columns"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import type { OrderBy } from "@/server/types/table"
import type { SortingState } from "@tanstack/react-table"

interface ProductProps {
    searchParams?: {
        query?: string
        page?: number
        limit?: number
        sort?: string
        orderBy?: OrderBy
    }
}

export default async function Product(props: ProductProps) {
    const { searchParams } = props

    const {
        query = "",
        page = 1,
        limit = 10,
        sort = "",
        orderBy = "desc",
    } = searchParams || {}

    const validatedLimit = validatePageSize(Number(limit), PAGE_SIZES)
    const sortState = createSortState(sort, orderBy)
    const sortParams = createSortParams(sort, orderBy)

    const { products, total } = await getProductsWithPagination({
        pagination: {
            page,
            limit: validatedLimit,
        },
        sort: sortParams,
    })

    const suspenseKey = searchParams?.toString()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your products.</CardDescription>
            </CardHeader>
            <CardContent>
                <Suspense key={suspenseKey} fallback={<p>Loading....</p>}>
                    <ProductDataTable
                        columns={columns}
                        data={products}
                        rowCount={total}
                        sort={sortState}
                        pagination={{
                            pageSize: validatedLimit,
                            pageIndex: page,
                        }}
                    />
                </Suspense>
            </CardContent>
        </Card>
    )
}

function createSortState(sort: string, orderBy: OrderBy): SortingState {
    if (!sort) return []

    return [
        {
            id: sort,
            desc: orderBy === "desc",
        },
    ]
}

function createSortParams(
    sort: string,
    orderBy: OrderBy
): ProductSortColumns | undefined {
    if (!isProductKey(sort)) return undefined

    return {
        column: sort,
        order: orderBy,
    }
}
