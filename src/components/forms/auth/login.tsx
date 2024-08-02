"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { RegisterSchema } from "@/schemas/auth/register"

import { Form } from "@/components/ui/form"

export default function LoginForm() {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
        },
    })

    return (
        <div className="">
            <Form {...form}>a</Form>
        </div>
    )
}
