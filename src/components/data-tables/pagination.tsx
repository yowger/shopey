"use client"

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { Table } from "@tanstack/react-table"

import { PAGE_SIZES } from "@/config/app"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    const pageSize = table.getState().pagination.pageSize
    const pageIndex = table.getState().pagination.pageIndex
    const totalRows = table.getRowCount()
    const pageCount = table.getPageCount()

    const startRow = pageIndex * pageSize + 1
    const endRow = Math.min(startRow + pageSize - 1, totalRows)

    const showTotalMessage = `Showing ${startRow} to ${endRow} of ${totalRows}`

    const visiblePages = 4
    const pageNumbers = []
    const startPage = Math.max(0, pageIndex - Math.floor(visiblePages / 2))
    const endPage = Math.min(pageCount, startPage + visiblePages)

    for (let i = startPage; i < endPage; i++) {
        pageNumbers.push(i)
    }

    return (
        <div className="flex items-center justify-between space-x-6 lg:space-x-8">
            <div className="flex text-sm font-medium">{showTotalMessage}</div>
            {/* <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div> */}
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows</p>
                <Select
                    value={`${pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                        />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {PAGE_SIZES.map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                {pageNumbers.map((pageNum) => (
                    <Button
                        key={pageNum}
                        variant={pageNum === pageIndex ? "default" : "outline"}
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(pageNum)}
                    >
                        {pageNum + 1}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
