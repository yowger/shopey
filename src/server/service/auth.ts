import { db } from "../db"

import { otpSchema } from "../schema/otp"

import type { Otp } from "../types/auth"

export type OtpInput = Pick<Otp, "userId" | "code" | "expires">

export async function createOtp(otpInput: OtpInput): Promise<void> {
    const { userId, code, expires } = otpInput

    await db.insert(otpSchema).values({
        userId,
        code,
        expires,
    })
}
