import { createStore } from "zustand/vanilla"

import createDeleteDialogSlice from "./slices/delete-dialog-state"
import { defaultProductState } from "./defaultState"

import type { ProductState } from "./defaultState"
import type {
    DeleteDialogSlice,
    DeleteDialogState,
} from "./slices/delete-dialog-state"

export type Store = DeleteDialogSlice

export const initStore = (): DeleteDialogState => {
    return defaultProductState
}

export const createProductStore = (
    initState: ProductState = defaultProductState
) => {
    return createStore<Store>()((set, get, store) => ({
        ...initState,
        ...createDeleteDialogSlice(set, get, store),
    }))
}
