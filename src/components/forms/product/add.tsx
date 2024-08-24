"use client"

import { useForm } from "react-hook-form"
import { PhilippinePeso } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import { ProductSchema } from "@/schemas/product/add"

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

import type { ProductInput } from "@/schemas/product/add"

export default function ProductForm() {
    const form = useForm<ProductInput>({
        resolver: zodResolver(ProductSchema),
    })
    const { handleSubmit, setError: setFormError, setFocus } = form

    async function onSubmit(values: ProductInput) {
        console.log("submitted: ", values)
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
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Create product
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
