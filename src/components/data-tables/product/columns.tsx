"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"

import { useProductStore } from "@/components/providers/product-store-provider"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "../columnHeader"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    // DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { Product } from "@/server/types/product"

// todo make global partial product
export const columns: ColumnDef<Omit<Product, "description">>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
    },
    {
        accessorKey: "created",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
            const created = row.original.created

            const formattedDate = format(
                new Date(created),
                "MMM d, yyyy - hh:mm a"
            )

            return formattedDate
        },
    },
    {
        accessorKey: "updated",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated" />
        ),
        cell: ({ row }) => {
            const updated = row.original.updated

            const formattedDate = format(
                new Date(updated),
                "MMM d, yyyy - hh:mm a"
            )

            return formattedDate
        },
    },
    {
        id: "actions",
        cell: function CellComponent({ row }) {
            const product = row.original

            const { openDeleteDialog, setProduct } = useProductStore(
                (state) => state
            )

            function handleOpenDeleteDialog() {
                const { id, title } = product

                setProduct({
                    id,
                    title,
                })

                openDeleteDialog()
            }

            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="p-0">
                            <Link
                                prefetch={false}
                                href={{
                                    pathname: "products/edit",
                                    query: { id: product.id },
                                }}
                                className="px-2 py-1.5 w-full"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleOpenDeleteDialog()}
                            className="cursor-pointer"
                        >
                            Delete
                        </DropdownMenuItem>
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
