"use client"

import dynamic from "next/dynamic"
import { useProductStore } from "@/components/providers/product-store-provider"

const DeleteDialog = dynamic(() => import("."), {
    ssr: false,
})

export default function DeleteProductContainer() {
    const { isDeleteProductOpen, currentSelectedProduct, resetProductState } =
        useProductStore((state) => state)

    if (!currentSelectedProduct || !isDeleteProductOpen) return null

    return (
        <DeleteDialog
            isOpen={isDeleteProductOpen}
            onClose={resetProductState}
            product={currentSelectedProduct}
        />
    )
}
