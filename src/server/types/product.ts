import { productsSchema } from "../schema/product"
import { productVariantsSchema } from "../schema/product"

export type Product = typeof productsSchema.$inferSelect
export type ProductVariant = typeof productVariantsSchema.$inferSelect
