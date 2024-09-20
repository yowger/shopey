"use client"

import { useProductStore } from "@/components/providers/product-store-provider"

import ProductVariantForm from "../../forms/product-variant"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

export default function AddProductContainer() {
    const {
        isAddVariantOpen,
        isEditVariantOpen,
        currentSelectedProductForVariant,
        resetVariantState,
    } = useProductStore((state) => state)

    const title = isAddVariantOpen
        ? "Add variant"
        : isEditVariantOpen
        ? "Edit variant"
        : null

    if (!isAddVariantOpen || !currentSelectedProductForVariant) return null

    return (
        <Sheet open={isAddVariantOpen} onOpenChange={resetVariantState}>
            <SheetContent
                style={{
                    maxWidth: "56rem",
                }}
            >
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                    <ProductVariantForm />
                </div>
            </SheetContent>
        </Sheet>
    )
}
