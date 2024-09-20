"use client"

import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { PhilippinePeso } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import { CreateProductVariantSchema } from "../../_schemas/product-variant"

import { createProductAction } from "@/server/actions/products/create"
import { updateProductAction } from "@/server/actions/products/update"

import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import InputTags from "../common/input-tags"

import type { ProductVariant } from "@/server/types/product"
import type { CreateProductVariantInput } from "../../_schemas/product-variant"

interface ProductFormProps {
    productVariant?: ProductVariant | null
}

export default function ProductVariantForm(props: ProductFormProps) {
    const { productVariant } = props
    const isEditMode = !!productVariant
    const initialValues = isEditMode
        ? productVariant
        : {
              color: "#000000",
          }

    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<CreateProductVariantInput>({
        resolver: zodResolver(CreateProductVariantSchema),
        defaultValues: initialValues,
    })
    const { handleSubmit } = form

    async function onSubmit(values: CreateProductVariantInput) {
        console.log("🚀 ~ onSubmit ~ values:", values)
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
                            <FormLabel>Variant color</FormLabel>
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
                <Button
                    type="submit"
                    className="w-full"
                    // disabled={}
                    tabIndex={4}
                >
                    {isEditMode ? "Update variant" : "Create Variant"}
                </Button>
            </form>
        </Form>
    )
}
