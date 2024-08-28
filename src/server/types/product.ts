import { getTableColumns, is } from "drizzle-orm"

import { productsSchema } from "../schema/product"

export type Product = typeof productsSchema.$inferSelect

export const productColumns = getTableColumns(productsSchema)
