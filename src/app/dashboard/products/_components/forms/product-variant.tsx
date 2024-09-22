"use client"

// import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
// import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

import { CreateProductVariantSchema } from "../../_schemas/product-variant"

// import { createProductAction } from "@/server/actions/products/create"
// import { updateProductAction } from "@/server/actions/products/update"

// import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { useUploadThing } from "@/lib/uploadthing/hooks"

import { Input } from "@/components/ui/input"
import InputTags from "../common/input-tags"
import MultiUploader from "../common/multi-uploader"
import { ProductDetails } from "../../_stores/slices/product-variant-dialog-ui"

import type { ProductVariant } from "@/server/types/product"
import type { CreateProductVariantInput } from "../../_schemas/product-variant"
import type { Json } from "@uploadthing/shared"
import type { UploadThingError } from "uploadthing/server"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ProductFormProps {
    product: ProductDetails
    productVariant?: ProductVariant | null
}

export default function ProductVariantForm(props: ProductFormProps) {
    const { product, productVariant } = props

    const isEditMode = !!productVariant
    const initialValues = isEditMode
        ? productVariant
        : {
              productId: product.id,
              color: "#000000",
          }

    // const router = useRouter()
    // const { toast } = useToast()

    const { startUpload, isUploading } = useUploadThing(
        "variantProductUploader",
        {
            onClientUploadComplete: () => {
                alert("uploaded successfully!")
            },
        }
    )

    const form = useForm<CreateProductVariantInput>({
        resolver: zodResolver(CreateProductVariantSchema),
        defaultValues: initialValues,
    })
    const { handleSubmit, setError, setValue } = form

    async function onSubmit(values: CreateProductVariantInput) {
        const result = await startUpload(values.variantImages)

        console.log("🚀 ~ onSubmit ~ result:", result)
    }

    function handleUploadError(error: UploadThingError<Json> | Error): void {
        setError("variantImages", {
            type: "validate",
            message: "Error uploading variant images.",
        })
    }

    function handleImageChange(files: File[]): void {
        console.log("🚀 ~ handleImageChange ~ files:", files)
        setValue("variantImages", files)
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Product title" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Input type="color" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <InputTags
                                    {...field}
                                    // tags={["hello", "there"]}
                                    onChange={(event) => field.onChange(event)}
                                    maxTags={10}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="variantImages"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <MultiUploader
                                    maxImageFiles={10}
                                    isUploading={isUploading}
                                    onChange={handleImageChange}
                                    onError={handleUploadError}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isUploading}
                    tabIndex={4}
                >
                    {isEditMode ? "Update variant" : "Create Variant"}
                </Button>
            </form>
        </Form>
    )
}
