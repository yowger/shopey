import * as z from "zod"

export const RegisterSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email(),
    password: z.string().min(5, {
        message: "Password must be at least 5 characters long",
    }),
})
