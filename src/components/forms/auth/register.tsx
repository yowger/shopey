"use client"

import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
import { CiCircleAlert } from "react-icons/ci"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { RegisterSchema } from "@/schemas/auth/register"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { register } from "@/server/actions/auth/register"

import { REGISTER_ERROR, type RegisterError } from "@/server/actions/auth/types"

export default function RegisterForm() {
    const [error, setError] = useState("")

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    })
    const { setError: setFormError, setFocus } = form

    const { execute, isExecuting } = useAction(register, {
        onError: (data) => {
            console.log("🚀 ~ RegisterForm ~ data:", data)
            setError("Something unexpected happened. Please try again later.")
        },
        onSuccess: (args) => {
            const { data } = args

            if (data?.code) {
                switch (data.code as RegisterError) {
                    case REGISTER_ERROR.USER_EXISTS:
                        setFocus("email")
                        setFormError("email", {
                            type: "manual",
                            message: "Email already in use.",
                        })
                        setError(
                            "Something unexpected happened. Please try again later."
                        )

                        break
                    default:
                        setError(
                            "Something unexpected happened. Please try again later."
                        )
                }
            }
        },
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-2.5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} type="text" />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {error && (
                    <div className="bg-destructive/25 flex text-xs font-medium items-center mt-2 gap-2 text-secondary-foreground p-3 rounded-md">
                        <CiCircleAlert className="size-5" />
                        <p>{error}</p>
                    </div>
                )}

                <Button disabled={isExecuting} className="w-full mt-6 mb-2">
                    Sign up
                </Button>

                <p className="line-text text-center mt-4 mb-6">
                    or continue with
                </p>

                <Button
                    className="flex gap-4 w-full"
                    variant={"outline"}
                    onClick={() =>
                        signIn("github", {
                            redirect: false,
                            callbackUrl: "/",
                        })
                    }
                >
                    Sign in with Github
                    <FaGithub className="w-5 h-5" />
                </Button>
            </form>
        </Form>
    )
}
