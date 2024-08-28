"use client"

import { Table } from "@tanstack/react-table"

import { DataTableViewOptions } from "../viewOptions"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    return (
        <div className="flex gap-2 items-center justify-between">
            <div className="flex flex-1 items-center space-x-2 ">
                <Input
                    placeholder="Filter products..."
                    value={
                        (table
                            .getColumn("title")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("title")
                            ?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-full lg:w-[300px]"
                />
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}
