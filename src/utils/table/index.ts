export function validatePageSize(value: number, page_sizes: number[]): number {
    return page_sizes.includes(value) ? value : page_sizes[0]
}
