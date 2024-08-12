export function partialCensorEmail(email: string): string {
    const [localPart, domain] = email.split("@")

    if (localPart.length <= 2) {
        return `${localPart.charAt(0)}***@${domain}`
    }

    const censoredLocalPart = `${localPart.slice(0, 2)}${"*".repeat(
        localPart.length - 4
    )}${localPart.slice(-2)}`

    return `${censoredLocalPart}@${domain}`
}
