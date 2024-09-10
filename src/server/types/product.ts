import { productsSchema } from "../schema/product"

export type Product = typeof productsSchema.$inferSelect
