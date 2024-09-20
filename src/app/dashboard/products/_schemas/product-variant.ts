import * as z from "zod"

export const ProductVariantSchema = z.object({
    productId: z.number(),
    productType: z.string().min(3, {
        message: "Product type must be at least 3 characters long.",
    }),
    color: z
        .string()
        .min(3, { message: "Color must be at least 3 characters long." }),
    tags: z.array(z.string()).min(1, {
        message: "At least one tag is required.",
    }),
    variantImages: z
        .array(
            z.object({
                url: z.string().refine((url) => url.search("blob:") !== 0, {
                    message: "Invalid URL format.",
                }),
                id: z.number().optional(),
                name: z.string(),
                key: z.string().optional(),
                size: z.number(),
            })
        )
        .min(1, { message: "At least one image is required." }),
})

export const CreateProductVariantSchema = ProductVariantSchema

export type CreateProductVariantInput = z.infer<
    typeof CreateProductVariantSchema
>
