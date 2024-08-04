"use server"

import bcrpyt from "bcrypt"
import { eq } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { db } from "@/server/db"

import { actionClient } from "@/lib/safeAction"

import { RegisterSchema } from "@/schemas/auth/register"
import { otp, users } from "@/server/schema"

import { REGISTER_ERROR } from "./types"
import { generateOtp } from "@/utils/generateOtp"
import { sendOtpEmail } from "./email"

// TODO: refactor to smaller functions
export const register = actionClient
    .schema(RegisterSchema, {
        handleValidationErrorsShape: (validationErrors) =>
            flattenValidationErrors(validationErrors).fieldErrors,
    })
    .action(async ({ parsedInput }) => {
        const { name, email, password } = parsedInput

        const saltRounds = 10
        const hashedPassword = await bcrpyt.hash(password, saltRounds)

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        })

        if (existingUser) {
            return {
                failure: "Email already in use.",
                code: REGISTER_ERROR.USER_EXISTS,
            }
        }

        try {
            const createdUser = await db
                .insert(users)
                .values({ name, email, password: hashedPassword })
                .returning({ id: users.id })
            console.log("🚀 ~ .action ~ createdUser:", createdUser[0].id)

            const otpCode = generateOtp()
            const expirationTime = new Date()
            expirationTime.setMinutes(expirationTime.getMinutes() + 15)

            await db.insert(otp).values({
                userId: createdUser[0].id,
                code: otpCode,
                expires: expirationTime,
            })

            await sendOtpEmail({
                userId: createdUser[0].id,
                email,
                code: otpCode,
            })
        } catch (error) {
            console.error("error user registration:", error)

            return {
                failure: "An error occurred during registration.",
                code: REGISTER_ERROR.REGISTRATION_ERROR,
            }
        }

        return {
            success: "OTP code has been sent to your email",
        }
    })
