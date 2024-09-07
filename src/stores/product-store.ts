/* for delete product context, might refactor names later on,
todo: refactor later on maybe.

todo: multi-delete
*/
import { createStore } from "zustand/vanilla"

import type { Product } from "@/server/types/product"

export type ProductDetails = Pick<Product, "id" | "title">

export type ProductState = {
    isAlertDialogOpen: boolean
    product: ProductDetails | null
}

export type ProductActions = {
    openAlertDialog: () => void
    closeAlertDialog: () => void
    setProduct: (product: ProductDetails | null) => void
}

export type ProductStore = ProductState & ProductActions

export const defaultInitState: ProductState = {
    isAlertDialogOpen: false,
    product: null,
}

export const createProductStore = (
    initState: ProductState = defaultInitState
) => {
    return createStore<ProductStore>()((set) => ({
        ...initState,
        openAlertDialog: () => set(() => ({ isAlertDialogOpen: true })),
        closeAlertDialog: () => set(() => ({ isAlertDialogOpen: false })),
        setProduct: (product: ProductDetails | null) =>
            set(() => ({ product })),
    }))
}
