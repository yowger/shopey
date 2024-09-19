import { Product } from "@/server/types/product"

export type ProductDetails = Pick<Product, "id" | "title">
