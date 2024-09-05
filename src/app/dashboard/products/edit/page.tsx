import ProductForm from "@/components/forms/product"

import { getCachedProductById } from "@/server/service/product"

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

    return <ProductForm product={product} />
}
