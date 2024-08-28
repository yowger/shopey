export type OrderBy = "asc" | "desc"

export interface Sort<T extends string | undefined = string> {
    column: T
    order: OrderBy
}

export interface Pagination {
    page: number
    limit: number
}
