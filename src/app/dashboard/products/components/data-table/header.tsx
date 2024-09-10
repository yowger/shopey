"use client"

import { Table } from "@tanstack/react-table"
import { CirclePlus, Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"

import { useEventListener } from "@/hooks/utils/useEventListener"

import { createHref } from "@/utils/url"

import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "../../../../../components/data-tables/viewOptions"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const inputRef = useRef<HTMLInputElement>(null)

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)

    function handleSearch() {
        const columnFilterState = table.getState().columnFilters

        const filterParams = columnFilterState
            .map((filter) => `${filter.id}:${filter.value}`)
            .join(",")

        params.set("filter", filterParams)
        const href = createHref(pathname, params)
        router.replace(href)
    }

    function keyDownEvents(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleSearch()
        }
    }

    function keyUpEvents(event: KeyboardEvent) {
        const isInputEmpty = inputRef.current?.value === ""

        if (isInputEmpty) {
            handleSearch()
        }
    }

    useEventListener("keydown", keyDownEvents)
    useEventListener("keyup", keyUpEvents)

    return (
        <div className="relative flex gap-2 items-center justify-between">
            <div className="relative flex flex-1 items-center space-x-2 z-20">
                <Input
                    ref={inputRef}
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
                    placeholder="Filter products"
                    autoFocus={true}
                    className="h-8 w-full lg:w-[300px]"
                />
                <Button
                    onClick={handleSearch}
                    variant="outline"
                    size="sm"
                    className="h-8 absolute top-0 end-0"
                >
                    <Search className="h-4 w-4" />
                </Button>
            </div>

            <DataTableViewOptions table={table} />
        </div>
    )
}
