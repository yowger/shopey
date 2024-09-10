export function validatePageSize(
    value: number,
    page_sizes: number[]
): number | undefined {
    return page_sizes.includes(value) ? value : undefined
}
