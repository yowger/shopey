import * as z from "zod"

const MAX_FILE_SIZE = 400000
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
]

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
            z
                .instanceof(File)
                .refine(
                    (file) => !file || (!!file && file.size <= 4 * 1024 * 1024),
                    {
                        message:
                            "The profile picture must be a maximum of 4MB.",
                    }
                )
                .refine(
                    (file) =>
                        !file || (!!file && file.type?.startsWith("image")),
                    {
                        message: "Only images are allowed to be sent.",
                    }
                )
        )
        .min(1, { message: "At least one image is required." }),
})

export const CreateProductVariantSchema = ProductVariantSchema

export type CreateProductVariantInput = z.infer<
    typeof CreateProductVariantSchema
>

/*
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

*/
