import { StateCreator } from "zustand"

import { Product } from "@/server/types/product"

export type ProductDetails = Omit<Product, "description">

export interface ProductDialogState {
    currentSelectedProduct: ProductDetails | null
    isDeleteProductOpen: boolean
}

export interface ProductDialogAction {
    setDeleteProductOpen: (open: boolean, product: ProductDetails) => void
    clearSelectedProduct: () => void
    resetProductState: () => void
}

export type ProductDialogSlice = ProductDialogState & ProductDialogAction

export const initialProductState: ProductDialogState = {
    currentSelectedProduct: null,
    isDeleteProductOpen: false,
}

export const createProductDialogSlice: StateCreator<ProductDialogSlice> = (
    set
) => ({
    ...initialProductState,
    setDeleteProductOpen: (open, product) =>
        set({
            isDeleteProductOpen: open,
            currentSelectedProduct: product,
        }),
    clearSelectedProduct: () => set({ currentSelectedProduct: null }),
    resetProductState: () => set(() => initialProductState),
})
