import { render } from "@react-email/render"
import { Resend } from "resend"

import env from "@/config/env/server"

import VerifyEmailTemplate from "@/components/email/verify"

const resend = new Resend(env.RESEND_API_KEY)

interface sendOtpEmailProps {
    username: string
    email: string
    code: string
}

export async function sendOtpEmail(props: sendOtpEmailProps) {
    const { username, email, code } = props

    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Verify email",
            html: render(VerifyEmailTemplate({ username, otpCode: code })),
        })

        return {
            error: null,
            success: true,
        }
    } catch (error) {
        return {
            error: (error as Error).message,
            success: false,
        }
    }
}
