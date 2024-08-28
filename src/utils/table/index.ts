export function validatePageSize(value: number, page_sizes: number[]): number {
    if (page_sizes.includes(value)) {
        console.log("YES")
        return value
    } else {
        console.log("NO")
        return page_sizes[0]
    }
}
