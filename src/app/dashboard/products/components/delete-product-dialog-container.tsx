"use client"

import dynamic from "next/dynamic"
import { useProductStore } from "@/components/providers/product-store-provider"

const DeleteDialog = dynamic(() => import("./delete-product-dialog"), {
    ssr: false,
})

export default function DeleteProductDialogContainer() {
    const { isDeleteDialogOpen, product, closeDeleteDialog } = useProductStore(
        (state) => state
    )

    if (!product || !isDeleteDialogOpen) return null

    return (
        <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={closeDeleteDialog}
            product={product}
        />
    )
}
