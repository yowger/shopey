"use server"

import bcrpyt from "bcrypt"
import { eq } from "drizzle-orm"

import { db } from "@/server/db"

import { actionClient } from "@/lib/safeAction"

import { sendOtpEmail } from "@/server/actions/auth/email/sendOtp"

import { RegisterSchema } from "@/schemas/auth/register"
import { otp, users } from "@/server/schema"

import { BadRequestError, ConflictError } from "@/errors/http"

import { generateOtp } from "@/utils/generateOtp"

// TODO: refactor to smaller functions
export const register = actionClient
    .schema(RegisterSchema)
    .action(async ({ parsedInput }) => {
        const { name, email, password } = parsedInput

        const saltRounds = 10
        const hashedPassword = await bcrpyt.hash(password, saltRounds)

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        })

        if (existingUser) {
            throw new ConflictError("Email already in use.")
        }

        try {
            const createdUser = await db
                .insert(users)
                .values({ name, email, password: hashedPassword })
                .returning({ id: users.id })

            const otpCode = generateOtp()
            const expirationTime = new Date()
            expirationTime.setMinutes(expirationTime.getMinutes() + 15)

            await db.insert(otp).values({
                userId: createdUser[0].id,
                code: otpCode,
                expires: expirationTime,
            })

            const { error } = await sendOtpEmail({
                username: name,
                email,
                code: otpCode,
            })

            if (error) {
                return {
                    success:
                        "Account created, but failed to send OTP email. Please try again later.",
                }
            }

            return {
                success: "OTP code has been sent to your email",
            }
        } catch (error) {
            throw new BadRequestError("An error occurred during registration.")
        }
    })
