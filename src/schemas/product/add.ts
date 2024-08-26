import * as z from "zod"

export const ProductSchema = z.object({
    title: z.string().min(5, {
        message: "Title must be at least 5 characters long",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters long",
    }),
    price: z.coerce
        .number({ invalid_type_error: "Price must be a number" })
        .positive({ message: "Price must be a positive number" }),
})

export const CreateProductSchema = ProductSchema

export const EditProductSchema = ProductSchema.extend({
    id: z.number({
        required_error: "ID is required for editing",
    }),
})

export type ProductInput = z.infer<typeof ProductSchema>
