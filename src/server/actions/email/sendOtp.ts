import { render } from "@react-email/render"
import { Resend } from "resend"

import env from "@/config/env/server"

import { logError } from "@/utils/logger/sub/error"

import VerifyEmailTemplate from "@/components/email/verify"

interface sendOtpEmailProps {
    username: string
    email: string
    code: string
}

const resend = new Resend(env.RESEND_API_KEY)

export async function sendOtpEmail(props: sendOtpEmailProps) {
    const { username, email, code } = props

    try {
        const { error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Verify email",
            html: render(VerifyEmailTemplate({ username, otpCode: code })),
        })

        if (error) {
            logError(error, true)

            return {
                error: error.message,
                success: false,
            }
        }

        return {
            error: null,
            success: true,
        }
    } catch (error) {
        logError(error as Error, false)

        return {
            error: "An unexpected error occurred.",
            success: false,
        }
    }
}
