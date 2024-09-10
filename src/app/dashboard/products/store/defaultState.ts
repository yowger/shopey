import { initialState } from "./slices/delete-dialog-state"

import type { DeleteDialogState } from "./slices/delete-dialog-state"

export type ProductState = DeleteDialogState

export const defaultProductState: ProductState = {
    ...initialState,
}
