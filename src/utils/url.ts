export function createHref(pathname: string, params: URLSearchParams): string {
    return `${pathname}?${params.toString()}`
}
