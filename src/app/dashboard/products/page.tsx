import Link from "next/link"
import { Plus } from "lucide-react"
import { Suspense } from "react"

import {
    getCachedProductsWithPagination,
    isProductKey,
    ProductFilter,
    ProductSortColumns,
} from "@/server/service/product/pagination"

import { PAGE_SIZES } from "@/config/app"

import { validatePageSize } from "@/utils/table/index"

import AddProductContainer from "./_components/dialogs/add-product/container"
import DeleteProductContainer from "./_components/dialogs/delete-product/container"
import { ProductDataTable } from "@/app/dashboard/products/_components/data-table"
import { Button } from "@/components/ui/button"
import { columns } from "@/app/dashboard/products/_components/data-table/columns"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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

    const filterState = parseFilterState(filter)
    const filterParams = crateFilterParams(filterState)
    const sortState = createSortState(sort, orderBy)
    const sortParams = createSortParams(sort, orderBy)
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
                    <CardTitle>
                        <div className="flex justify-between items-center">
                            Products
                            <Button asChild variant="secondary" size="sm">
                                <Link
                                    href="/dashboard/products/add"
                                    prefetch={false}
                                >
                                    <div className="ml-auto flex items-center">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Product
                                    </div>
                                </Link>
                            </Button>
                        </div>
                    </CardTitle>
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
            <AddProductContainer />
            <DeleteProductContainer />
        </>
    )
}

function parseFilterState(filter?: string): ColumnFiltersState | undefined {
    if (!filter) return undefined

    const parsedFilterState = filter.split(",").map((filterStr) => {
        const [id, value] = filterStr.split(":")

        return { id, value }
    })

    return parsedFilterState
}

function crateFilterParams(
    filterState?: ColumnFiltersState
): ProductFilter[] | undefined {
    if (!filterState) return undefined

    const filterParams = filterState
        .map((filterItem) => {
            if (isProductKey(filterItem.id)) {
                const column = filterItem.id
                const value = filterItem.value as string

                const filterStateParam = {
                    column,
                    value,
                }

                return filterStateParam
            }

            return null
        })
        .filter((filterItem) => filterItem !== null)

    return filterParams
}

function createSortState(
    sort?: string,
    orderBy?: OrderBy
): SortingState | undefined {
    if (!sort || !orderBy) return undefined

    const sortState = [
        {
            id: sort,
            desc: orderBy === "desc",
        },
    ]

    return sortState
}

function createSortParams(
    sort?: string,
    orderBy?: OrderBy
): ProductSortColumns | undefined {
    if (!sort || !orderBy || !isProductKey(sort)) return undefined

    const sortParams = {
        column: sort,
        order: orderBy,
    }

    return sortParams
}
