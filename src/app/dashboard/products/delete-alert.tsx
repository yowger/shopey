"use client"

import { useAction } from "next-safe-action/hooks"

import { useProductStore } from "@/components/providers/product-store-provider"

import { deleteProductAction } from "@/server/actions/products/delete"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function DeleteAlert() {
    const { isAlertDialogOpen, product, closeAlertDialog } = useProductStore(
        (state) => state
    )

    const { execute, isExecuting } = useAction(deleteProductAction, {
        onError: () => {
            closeAlertDialog()

            toast({
                variant: "destructive",
                title: "Product delete failed.",
                description: "There was a problem deleting the product.",
            })
        },
        onSuccess: (params) => {
            const { data } = params

            closeAlertDialog()

            const successMessage =
                data?.success || "Product deleted successfully."

            toast({
                title: "Product deleted",
                description: successMessage,
            })
        },
    })

    function handleDeleteProduct() {
        if (!product) {
            return
        }

        execute({ id: product.id })
    }

    return (
        <Dialog open={isAlertDialogOpen} onOpenChange={closeAlertDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        You are about to delete the following products, This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex">
                    {product ? (
                        <ul className="text-sm list-inside list-disc">
                            <li>{product.title}</li>
                        </ul>
                    ) : null}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleDeleteProduct}
                        type="button"
                        variant="destructive"
                        disabled={isExecuting}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
