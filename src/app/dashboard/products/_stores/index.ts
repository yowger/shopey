import { createStore } from "zustand/vanilla"

import { createProductDialogSlice } from "./slices/product-dialog-ui"
import { defaultProductState } from "./defaultState"

import type { ProductState } from "./defaultState"
import type { ProductDialogSlice } from "./slices/product-dialog-ui"

export type Store = ProductDialogSlice

export const initStore = (): ProductState => {
    return defaultProductState
}

export const createProductStore = (
    initState: ProductState = defaultProductState
) => {
    return createStore<Store>()((set, get, store) => ({
        ...initState,
        ...createProductDialogSlice(set, get, store),
    }))
}
