import { Suspense } from "react"

import {
    getProductsWithPagination,
    isProductKey,
    ProductKeys,
    ProductSortColumns,
} from "@/server/service/product"

import { ProductDataTable } from "@/components/data-tables/product"
import { columns } from "@/components/data-tables/product/columns"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import type { SortingState } from "@tanstack/react-table"

interface ProductProps {
    searchParams?: {
        query?: string
        page?: number
        limit?: number
        sort?: string
    }
}

export default async function Product(props: ProductProps) {
    const { searchParams } = props

    const limit = Number(searchParams?.limit) || 10
    const query = searchParams?.query || ""
    const currentPage = Number(searchParams?.page) || 1
    const sort = searchParams?.sort || ""

    const sortState = sort.split(",").map((sortItem) => {
        const [id, order] = sortItem.split(":")
        const isDesc = order === "desc"

        return {
            desc: isDesc,
            id: id.trim(),
        }
    }) satisfies SortingState

    // const sortParams  = sortState.map((sortItem) => ({
    //     columns: sortItem.id,
    //     order: sortItem.desc ? "desc" : "asc",
    // })) satisfies ProductSortColumns

    const sortParams = sortState
        .filter((sortItem) => isProductKey(sortItem.id))
        .map((sortItem) => ({
            column: sortItem.id as ProductKeys,
            order: sortItem.desc ? "desc" : "asc",
        })) satisfies ProductSortColumns
    console.log("🚀 ~ Product ~ sortParams:", sortParams)

    const { products, total: totalProducts } = await getProductsWithPagination({
        pagination: {
            page: currentPage,
            limit,
        },
        sort: sortParams,
    })

    const suspenseKey = limit + query + currentPage

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
                        rowCount={totalProducts}
                        sort={sortState}
                        pagination={{
                            pageSize: limit,
                            pageIndex: currentPage,
                        }}
                    />
                </Suspense>
            </CardContent>
        </Card>
    )
}
