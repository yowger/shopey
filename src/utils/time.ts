export function calculateExpirationTimeInMin(minutes: number): Date {
    const expirationTime = new Date()
    expirationTime.setMinutes(expirationTime.getMinutes() + minutes)

    return expirationTime
}
