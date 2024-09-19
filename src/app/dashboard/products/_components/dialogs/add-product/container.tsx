"use client"

import { useEffect, useState } from "react"

import { getCachedProductById } from "@/server/service/product"

import { useProductStore } from "@/components/providers/product-store-provider"

import ProductForm from "@/app/dashboard/products/_components/forms/product"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

export default function AddProductContainer() {
    const { isAddProductOpen, isEditProductOpen, resetProductState } =
        useProductStore((state) => state)

    const title = isAddProductOpen
        ? "Add Product"
        : isEditProductOpen
        ? "Edit Product"
        : null

    if (!isAddProductOpen) return null

    return (
        <Sheet open={isAddProductOpen} onOpenChange={resetProductState}>
            <SheetContent
                style={{
                    maxWidth: "56rem",
                }}
            >
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                    <ProductForm />
                </div>
            </SheetContent>
        </Sheet>
    )
}
