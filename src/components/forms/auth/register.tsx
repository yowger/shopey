"use client"

import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { register } from "@/server/actions/auth/register"

import { RegisterSchema } from "@/schemas/auth/register"

import { HttpStatusCodes } from "@/errors/http"
import { isBaseError } from "@/errors/utils/isBaseError"

import { GENERIC_ERROR_MESSAGE } from "@/constants/messages/errors"

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
import ErrorMessage from "@/components/alert/errorMessage"
import SuccessMessage from "@/components/alert/successMessage"

export default function RegisterForm() {
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    })
    const { setError: setFormError, setFocus } = form

    const { execute, isExecuting } = useAction(register, {
        onError: (args) => {
            const { error } = args
            const { serverError } = error

            setErrorMessage("")
            setSuccessMessage("")

            if (isBaseError(serverError)) {
                switch (serverError.httpStatusCode) {
                    case HttpStatusCodes.CONFLICT:
                        setFocus("email")
                        setFormError("email", {
                            type: "manual",
                            message: "Email already in use.",
                        })

                        return
                    case HttpStatusCodes.BAD_REQUEST:
                        setErrorMessage(serverError.description)

                        return
                }
            }

            setErrorMessage(GENERIC_ERROR_MESSAGE)
        },
        onSuccess: (args) => {
            const { data } = args

            setErrorMessage("")
            setSuccessMessage("")

            if (data?.success.message) {
                setSuccessMessage(data.success.message)

                return
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

                <ErrorMessage message={errorMessage} className="mt-2" />
                <SuccessMessage message={successMessage} className="mt-2" />

                <Button disabled={isExecuting} className="w-full mt-6 mb-2">
                    Sign up
                </Button>

                <p className="line-text text-center mt-4 mb-6 text-sm">
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
