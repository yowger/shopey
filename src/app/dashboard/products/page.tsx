import { Suspense } from "react"

import { getProductsWithPagination } from "@/server/service/product"

import { ProductDataTable } from "@/components/data-tables/product"
import { columns } from "@/components/data-tables/product/columns"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DataTablePagination } from "@/components/data-tables/pagination"

interface ProductProps {
    searchParams?: {
        query?: string
        page?: number
        limit?: number
    }
}

export default async function Product(props: ProductProps) {
    const { searchParams } = props

    const limit = Number(searchParams?.limit) || 10
    const query = searchParams?.query || ""
    const currentPage = Number(searchParams?.page) || 1

    const suspenseKey = limit + query + currentPage

    const { products, total: totalProducts } = await getProductsWithPagination({
        page: currentPage,
        limit,
    })

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
