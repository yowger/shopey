import { Suspense } from "react"

import {
    getCachedProductsWithPagination,
    isProductKey,
    ProductFilter,
    ProductSortColumns,
} from "@/server/service/product/pagination"

import { PAGE_SIZES } from "@/config/app"

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
import DeleteAlert from "./delete-alert"

import type { OrderBy } from "@/server/types/table"
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table"

interface ProductProps {
    searchParams: {
        page?: number
        limit?: number
        filter?: string
        sort?: string
        orderBy?: OrderBy
    }
}

export default async function Product(props: ProductProps) {
    const { searchParams } = props
    const {
        page = 1,
        limit = 10,
        filter,
        sort,
        orderBy = "desc",
    } = searchParams || {}

    const filterState = filter ? parseFilterState(filter) : undefined
    const filterParams = filterState
        ? crateFilterParams(filterState)
        : undefined
    const sortState = sort ? createSortState(sort, orderBy) : undefined
    const sortParams = sort ? createSortParams(sort, orderBy) : undefined
    const PageLimit = validatePageSize(Number(limit), PAGE_SIZES)

    const { products, total: totalProducts } =
        await getCachedProductsWithPagination({
            filters: filterParams,
            sort: sortParams,
            pagination: {
                page,
                limit: PageLimit,
            },
        })

    const suspenseKey = JSON.stringify({ ...searchParams })

    return (
        <>
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
                            filter={filterState}
                            rowCount={totalProducts}
                            sort={sortState}
                            pagination={{
                                pageSize: PageLimit,
                                pageIndex: page,
                            }}
                        />
                    </Suspense>
                </CardContent>
            </Card>
            <DeleteAlert />
        </>
    )
}

function parseFilterState(filter: string): ColumnFiltersState {
    return filter.split(",").map((filterStr) => {
        const [id, value] = filterStr.split(":")

        return { id, value }
    })
}

function crateFilterParams(filterState: ColumnFiltersState): ProductFilter[] {
    return filterState
        .map((filterItem) => {
            if (isProductKey(filterItem.id)) {
                const column = filterItem.id
                const value = filterItem.value as string

                return {
                    column,
                    value,
                }
            }

            return null
        })
        .filter((filterItem) => filterItem !== null)
}

function createSortState(sort: string, orderBy: OrderBy): SortingState {
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
