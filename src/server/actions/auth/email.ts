import { Resend } from "resend"

import env from "@/config/env/server"

import getBaseUrl from "@/utils/getBaseUrl"

const resend = new Resend(env.RESEND_API_KEY)

const domain = getBaseUrl()

interface sendOtpEmailProps {
    userId: string
    email: string
    code: string
}

export async function sendOtpEmail(props: sendOtpEmailProps) {
    const { userId, email, code } = props

    const verifyLink = `${domain}/verify?code=${code}`

    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "Verify email",
        html: `<p>Your OTP code is ${code}. You can also click the link below <a href='${verifyLink}'>Verify email</a></p>`,
    })

    if (error) {
        console.log(error)

        return
    }

    return data
}
