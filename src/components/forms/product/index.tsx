"use client"

import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { PhilippinePeso } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import { CreateProductSchema, UpdateProductSchema } from "@/schemas/product"

import { createProductAction } from "@/server/actions/products/create"
import { updateProductAction } from "@/server/actions/products/update"

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
import RichTextEditor from "@/components/tiptap"
import { useToast } from "@/components/ui/use-toast"

import type { Product } from "@/server/types/product"
import type { CreateProductInput, UpdateProductInput } from "@/schemas/product"

interface ProductFormProps {
    product?: Product
}

export default function ProductForm(props: ProductFormProps) {
    const { product } = props
    const isEditMode = !!product
    const initialValues = isEditMode ? product : {}
    const productSchema = isEditMode ? UpdateProductSchema : CreateProductSchema
    const productAction = isEditMode ? updateProductAction : createProductAction

    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<CreateProductInput | UpdateProductInput>({
        resolver: zodResolver(productSchema),
        defaultValues: initialValues,
    })
    const { handleSubmit } = form

    const { execute, isExecuting } = useAction(productAction, {
        onError: () => {
            const title = isEditMode
                ? "Product update failed."
                : "Product creation failed."
            const description = isEditMode
                ? "There was a problem updating the product."
                : "There was a problem creating the product."

            toast({
                variant: "destructive",
                title,
                description,
            })
        },
        onSuccess: (params) => {
            const { data } = params
            
            const title = isEditMode ? "Product updated." : "Product created."
            const successMessage = isEditMode
                ? data?.success || "Product updated successfully."
                : data?.success || "Product created successfully."

            router.push("/dashboard/products")

            toast({
                title,
                description: successMessage,
            })
        },
    })

    async function onSubmit(values: CreateProductInput | UpdateProductInput) {
        execute(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {isEditMode ? "Edit product" : "New product"}
                </CardTitle>
                <CardDescription>
                    {isEditMode
                        ? "Modify existing product"
                        : "Enter product details"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Product title"
                                            tabIndex={1}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            tabIndex={2}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Price</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <PhilippinePeso
                                                size={34}
                                                className="p-2 bg-muted  rounded-md"
                                            />
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Price in Philippine peso"
                                                step="0.1"
                                                min={0}
                                                tabIndex={3}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isExecuting}
                            tabIndex={4}
                        >
                            {isEditMode ? "Update product" : "Create product"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
