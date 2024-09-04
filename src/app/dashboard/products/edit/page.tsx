import ProductForm from "@/components/forms/product"

import { getProductById } from "@/server/service/product"

interface EditProductProps {
    searchParams: {
        id: number
    }
}

export default async function EditProduct(props: EditProductProps) {
    const { searchParams } = props
    const { id } = searchParams

    const product = await getProductById(id)

    if (!product) {
        return <p>Product not found</p>
    }

    return <ProductForm product={product} />
}
