import ProductForm from "@/app/dashboard/products/_components/forms/product"

import { getCachedProductById } from "@/server/service/product"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface EditProductProps {
    searchParams: {
        id: number
    }
}

export default async function EditProduct(props: EditProductProps) {
    const { searchParams } = props
    const { id } = searchParams

    const product = await getCachedProductById(id)

    if (!product) {
        return <p>Product not found</p>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit product</CardTitle>
                <CardDescription>Modify existing product</CardDescription>
            </CardHeader>
            <CardContent>
                <ProductForm product={product} />
            </CardContent>
        </Card>
    )
}
