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

export const DeleteProductSchema = z.object({
    id: z.number({
        required_error: "ID is required for deleting",
    }),
})

export const UpdateProductSchema = ProductSchema.extend({
    id: z.number({
        required_error: "ID is required for editing",
    }),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>
export type DeleteProductInput = z.infer<typeof UpdateProductSchema>
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
