import { db } from "../db"

import { otp, users } from "../schema"

import { InsertOtp } from "../types/auth"

export type CreateOtpData = Pick<InsertOtp, "userId" | "code" | "expires">

export async function createOtp(otpData: CreateOtpData): Promise<void> {
    const { userId, code, expires } = otpData

    await db.insert(otp).values({
        userId,
        code,
        expires,
    })
}
