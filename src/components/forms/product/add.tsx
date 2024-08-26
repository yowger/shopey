"use client"

import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { PhilippinePeso } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import { CreateProductSchema } from "@/schemas/product/add"

import { addProduct } from "@/server/actions/products/add"

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

import type { ProductInput } from "@/schemas/product/add"

export default function ProductForm() {
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<ProductInput>({
        resolver: zodResolver(CreateProductSchema),
    })
    const { handleSubmit } = form

    const { execute, isExecuting } = useAction(addProduct, {
        onError: (args) => {
            toast({
                variant: "destructive",
                title: "Product creation failed.",
                description: "There was a problem creating the product.",
            })
        },
        onSuccess: (args) => {
            const { data } = args

            const successMessage =
                data?.success || "Product created successfully."

            router.push("/dashboard/products")

            toast({
                title: "Product created.",
                description: successMessage,
            })
        },
    })

    async function onSubmit(values: ProductInput) {
        execute(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create product</CardTitle>
                <CardDescription>Enter product details</CardDescription>
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
                            Create product
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
