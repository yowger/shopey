import { StateCreator } from "zustand"

import type { Product } from "@/server/types/product"

export type VariantDetails = Product
export type ProductDetails = Omit<Product, "description">

export interface VariantDialogState {
    currentSelectedProductForVariant: ProductDetails | null
    currentSelectedVariant: VariantDetails | null
    isAddVariantOpen: boolean
    isEditVariantOpen: boolean
    isDeleteVariantOpen: boolean
}

export interface VariantDialogAction {
    setAddVariantOpen: (open: boolean, product: ProductDetails) => void
    setEditVariantOpen: (
        open: boolean,
        product: ProductDetails,
        variant: VariantDetails
    ) => void
    setDeleteVariantOpen: (
        open: boolean,
        product: ProductDetails,
        variant: VariantDetails
    ) => void
    clearSelectedVariant: () => void
    resetVariantState: () => void
}

export type VariantDialogSlice = VariantDialogState & VariantDialogAction

export const initialVariantState: VariantDialogState = {
    currentSelectedProductForVariant: null,
    currentSelectedVariant: null,
    isAddVariantOpen: false,
    isEditVariantOpen: false,
    isDeleteVariantOpen: false,
}

export const createVariantDialogSlice: StateCreator<VariantDialogSlice> = (
    set
) => ({
    ...initialVariantState,
    setAddVariantOpen: (open, product) =>
        set({
            isAddVariantOpen: open,
            currentSelectedProductForVariant: product,
            currentSelectedVariant: null,
        }),
    setEditVariantOpen: (open, product, variant) =>
        set({
            isEditVariantOpen: open,
            currentSelectedProductForVariant: product,
            currentSelectedVariant: variant,
        }),
    setDeleteVariantOpen: (open, product, variant) =>
        set({
            isDeleteVariantOpen: open,
            currentSelectedProductForVariant: product,
            currentSelectedVariant: variant,
        }),
    clearSelectedVariant: () => set({ currentSelectedVariant: null }),
    resetVariantState: () => set(() => initialVariantState),
})
