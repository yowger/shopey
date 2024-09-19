import { initialProductState } from "./slices/product-dialog-ui"
import { initialVariantState } from "./slices/product-variant-dialog-ui"

import type { ProductDialogState } from "./slices/product-dialog-ui"
import type { VariantDialogState } from "./slices/product-variant-dialog-ui"

export type ProductState = ProductDialogState & VariantDialogState

export const defaultProductState: ProductState = {
    ...initialProductState,
    ...initialVariantState,
}
