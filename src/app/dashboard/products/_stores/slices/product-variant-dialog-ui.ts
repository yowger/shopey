import { StateCreator } from "zustand"

export type Variant = {
    id: string
    name: string
    price: number
    productId: string
}

export type VariantDetails = Variant

export interface VariantDialogState {
    currentSelectedVariant: VariantDetails | null
    isAddVariantOpen: boolean
    isEditVariantOpen: boolean
    isDeleteVariantOpen: boolean
}

export interface VariantDialogAction {
    setAddVariantOpen: (open: boolean) => void
    setEditVariantOpen: (open: boolean, variant: VariantDetails) => void
    setDeleteVariantOpen: (open: boolean, variant: VariantDetails) => void
    clearSelectedVariant: () => void
    resetVariantState: () => void
}

export type VariantDialogSlice = VariantDialogState & VariantDialogAction

export const initialVariantState: VariantDialogState = {
    currentSelectedVariant: null,
    isAddVariantOpen: false,
    isEditVariantOpen: false,
    isDeleteVariantOpen: false,
}

export const createVariantDialogSlice: StateCreator<VariantDialogSlice> = (
    set
) => ({
    ...initialVariantState,
    setAddVariantOpen: (open) => set({ isAddVariantOpen: open }),
    setEditVariantOpen: (open, variant) =>
        set({
            isEditVariantOpen: open,
            currentSelectedVariant: variant,
        }),
    setDeleteVariantOpen: (open, variant) =>
        set({
            isDeleteVariantOpen: open,
            currentSelectedVariant: variant,
        }),
    clearSelectedVariant: () => set({ currentSelectedVariant: null }),
    resetVariantState: () => set(() => initialVariantState),
})
