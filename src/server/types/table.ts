export interface Sort<T extends string | undefined = string> {
    column: T
    order: "asc" | "desc"
}

export interface Pagination {
    page: number
    limit: number
}
