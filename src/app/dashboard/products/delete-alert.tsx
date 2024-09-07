"use client"

import { useProductStore } from "@/components/providers/product-store-provider"

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

export default function DeleteAlert() {
    const { isAlertDialogOpen, product, closeAlertDialog } = useProductStore(
        (state) => state
    )

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
                    <Button type="button" variant="destructive">
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
