import { StateCreator } from "zustand"

import type { Product } from "@/server/types/product"

export type ProductDetails = Pick<Product, "id" | "title">

export interface DeleteDialogState {
    isDeleteDialogOpen: boolean
    product: ProductDetails | null
}

export type DeleteDialogActions = {
    openDeleteDialog: () => void
    closeDeleteDialog: () => void
    setProduct: (product: ProductDetails) => void
    resetDeleteDialog: () => void
}

export type DeleteDialogSlice = DeleteDialogState & DeleteDialogActions

export const initialState: DeleteDialogState = {
    isDeleteDialogOpen: false,
    product: null,
}

const createDeleteDialogSlice: StateCreator<DeleteDialogSlice> = (set) => ({
    ...initialState,
    openDeleteDialog: () => set(() => ({ isDeleteDialogOpen: true })),
    closeDeleteDialog: () => set(() => ({ isDeleteDialogOpen: false })),
    setProduct: (product: ProductDetails) => set(() => ({ product })),
    resetDeleteDialog: () => set(() => initialState),
})

export default createDeleteDialogSlice
