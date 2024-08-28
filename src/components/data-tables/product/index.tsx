"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "../pagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import type { ColumnDef, SortingState } from "@tanstack/react-table"

interface Pagination {
    pageIndex: number
    pageSize: number
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    rowCount: number
    pagination: Pagination
    sort: SortingState
}

export function ProductDataTable<TData, TValue>(
    props: DataTableProps<TData, TValue>
) {
    const { columns, data, rowCount, sort, pagination } = props

    const pathname = usePathname()
    const { replace } = useRouter()
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)

    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>(sort)

    const table = useReactTable({
        data,
        columns,
        rowCount: rowCount,
        manualSorting: true,
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: pagination.pageIndex - 1,
                pageSize: pagination.pageSize,
            },
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: (updater) => {
            // refactor to 2 functions
            if (typeof updater !== "function") return

            const newPageState = updater(table.getState().pagination)

            const page = newPageState.pageIndex + 1
            const pageSize = newPageState.pageSize

            params.set("page", String(page))
            params.set("limit", String(pageSize))

            replace(`${pathname}?${params.toString()}`)
        },
        onSortingChange: (updater) => {
            if (typeof updater !== "function") return

            const newSortingState = updater(table.getState().sorting)

            setSorting(newSortingState)

            if (newSortingState.length > 0) {
                const newSortParams = newSortingState
                    .map((sort) => {
                        const { id, desc } = sort
                        return `${id}:${desc ? "desc" : "asc"}`
                    })
                    .join(",")

                params.set("sort", newSortParams)

                replace(`${pathname}?${params.toString()}`)
            }
        },
    })

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}
