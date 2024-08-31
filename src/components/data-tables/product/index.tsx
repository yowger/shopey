"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "../pagination"
import { DataTableToolbar } from "./header"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import type {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    Updater,
} from "@tanstack/react-table"

interface Pagination {
    pageIndex: number
    pageSize: number
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filter?: ColumnFiltersState
    pagination: Pagination
    rowCount: number
    sort?: SortingState
}

export function ProductDataTable<TData, TValue>(
    props: DataTableProps<TData, TValue>
) {
    const {
        columns,
        data,
        filter = [],
        rowCount,
        pagination,
        sort = [],
    } = props

    // const [rowSelection, setRowSelection] = useState({})
    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>(filter)
    const [sorting, setSorting] = useState<SortingState>(sort)
    const pathname = usePathname()
    const { replace } = useRouter()
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)

    const table = useReactTable({
        data,
        columns,
        rowCount,
        manualFiltering: true,
        manualSorting: true,
        manualPagination: true,
        state: {
            columnFilters,
            pagination: {
                pageIndex: pagination.pageIndex - 1,
                pageSize: pagination.pageSize,
            },
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: handleFiltersChange,
        onPaginationChange: handlePaginationChange,
        onSortingChange: handleSortingChange,
    })

    function handleFiltersChange(updater: Updater<ColumnFiltersState>) {
        if (typeof updater !== "function") return

        const oldColumnFiltersState = table.getState().columnFilters
        const newColumnFiltersState = updater(oldColumnFiltersState)

        setColumnFilters(newColumnFiltersState)
        const filterParams = newColumnFiltersState
            .map((filter) => `${filter.id}:${filter.value}`)
            .join(",")

        params.set("filter", filterParams)
        const href = createHref(pathname, params)
        replace(href)
    }

    function handlePaginationChange(updater: Updater<PaginationState>) {
        if (typeof updater !== "function") return

        const oldPageState = table.getState().pagination
        const newPageState = updater(oldPageState)

        const page = newPageState.pageIndex + 1
        const pageSize = newPageState.pageSize

        params.set("page", String(page))
        params.set("limit", String(pageSize))
        const href = createHref(pathname, params)
        replace(href)
    }

    function handleSortingChange(updater: Updater<SortingState>) {
        if (typeof updater !== "function") return

        const oldSortingState = table.getState().sorting
        const newSortingState = updater(oldSortingState)

        setSorting(newSortingState)

        const { id, desc } = newSortingState[0]
        const orderBy = desc ? "desc" : "asc"

        params.set("sort", id)
        params.set("orderBy", orderBy)
        const href = createHref(pathname, params)
        replace(href)
    }

    function createHref(pathname: string, params: URLSearchParams): string {
        return `${pathname}?${params.toString()}`
    }

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} />
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
