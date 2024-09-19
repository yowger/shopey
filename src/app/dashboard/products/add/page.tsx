import ProductForm from "@/app/dashboard/products/_components/forms/product"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function AddProduct() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>New product</CardTitle>
                <CardDescription>Enter product details</CardDescription>
            </CardHeader>
            <CardContent>
                <ProductForm />
            </CardContent>
        </Card>
    )
}
