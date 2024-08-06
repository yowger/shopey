import { randomInt } from "crypto"

export function generateOtp(length: number = 6): string {
    let otp = ""

    for (let i = 0; i < length; i++) {
        otp += randomInt(0, 10).toString()
    }

    return otp
}
