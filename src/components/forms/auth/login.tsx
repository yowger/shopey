"use client"

// import Link from "next/link"
import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { LoginSchema } from "@/schemas/auth/login"

import { HttpStatusCodes } from "@/errors/http"
import { isBaseError } from "@/errors/utils/isBaseError"

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
import ErrorMessage from "@/components/alert/errorMessage"
import SuccessMessage from "@/components/alert/successMessage"

import { login } from "@/server/actions/auth/login"

import { GENERIC_ERROR_MESSAGE } from "@/constants/messages/errors"

import { Input } from "@/components/ui/input"

import type { LoginInput } from "@/schemas/auth/login"

export default function LoginForm() {
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const form = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    })
    const { setError: setFormError, setFocus } = form

    const { execute, isExecuting } = useAction(login, {
        onError: (args) => {
            const { error } = args
            const { serverError } = error

            setSuccessMessage("")

            if (isBaseError(serverError)) {
                switch (serverError.httpStatusCode) {
                    case HttpStatusCodes.NOT_FOUND:
                        setFocus("email")
                        setFormError("email", {
                            type: "manual",
                            message: serverError.description,
                        })

                        return
                    case HttpStatusCodes.BAD_REQUEST:
                        setErrorMessage(serverError.description)

                        return
                    default:
                        setErrorMessage(serverError.description)

                        return
                }
            }

            setErrorMessage(GENERIC_ERROR_MESSAGE)
        },
        onSuccess: (args) => {
            setErrorMessage("")

            setSuccessMessage("sign in successfully")
        },
    })

    const onSubmit = (values: LoginInput) => {
        execute(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    autoComplete="email"
                                />
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
                                <Input
                                    {...field}
                                    type="password"
                                    autoComplete="current-password"
                                />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <ErrorMessage message={errorMessage} />
                <SuccessMessage message={successMessage} />

                {/* <Link
                    className="text-sm font-bold text-blue-600 inline-block"
                    href="/auth/reset"
                >
                    Forgot your password
                </Link> */}

                <Button type="submit" className="w-full" disabled={isExecuting}>
                    Sign in
                </Button>

                <p className="line-text text-center text-sm">
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
