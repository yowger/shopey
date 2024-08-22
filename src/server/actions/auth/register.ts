"use server"

import bcrpyt from "bcrypt"
import { createId } from "@paralleldrive/cuid2"

import { actionClient } from "@/lib/safeAction"

import { createUser, findUserByEmail } from "@/server/service/user"
import { sendOtpEmail } from "@/server/actions/email/sendOtp"
import { createOtp } from "@/server/service/auth"

import { RegisterSchema } from "@/schemas/auth/register"

import { ConflictError, InternalServerError } from "@/errors/http"

import { calculateExpirationTimeInMin } from "@/utils/time"
import { generateOtp } from "@/utils/generateOtp"

export const register = actionClient
    .schema(RegisterSchema)
    .action(async ({ parsedInput }) => {
        const { name, email, password } = parsedInput

        const saltRounds = 10
        const hashedPassword = await bcrpyt.hash(password, saltRounds)

        const existingUser = await findUserByEmail(email)

        if (existingUser) {
            throw new ConflictError({
                id: createId(),
                description: "Email already in use.",
            })
        }

        try {
            const userId = await createUser({
                name,
                email,
                password: hashedPassword,
            })

            const otpCode = generateOtp()
            const expirationTime = calculateExpirationTimeInMin(15)

            await createOtp({
                userId,
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
                    success: {
                        message:
                            "Account created, but failed to send OTP email. Please try again later.",
                    },
                }
            }

            return {
                success: {
                    message: "OTP code has been sent to your email",
                },
            }
        } catch (error) {
            throw new InternalServerError({
                id: createId(),
            })
        }
    })
