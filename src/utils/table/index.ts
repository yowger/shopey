export function validatePageSize(value: number, page_sizes: number[]): number {
    if (page_sizes.includes(value)) {
        return value
    } else {
        return page_sizes[0]
    }
}
