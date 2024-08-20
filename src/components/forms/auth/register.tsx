"use client"

import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { register } from "@/server/actions/auth/register"

import { RegisterInput, RegisterSchema } from "@/schemas/auth/register"

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

    const form = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
    })
    const { setError: setFormError, setFocus } = form

    const { execute, isExecuting } = useAction(register, {
        onError: (args) => {
            const { error } = args
            const { serverError } = error

            setSuccessMessage("")

            if (isBaseError(serverError)) {
                switch (serverError.httpStatusCode) {
                    case HttpStatusCodes.CONFLICT:
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
            const { data } = args

            setErrorMessage("")

            if (data?.success.message) {
                setSuccessMessage(data.success.message)

                return
            }
        },
    })

    const onSubmit = (values: RegisterInput) => {
        execute(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                <ErrorMessage message={errorMessage} />
                <SuccessMessage message={successMessage} />

                <Button className="w-full" disabled={isExecuting}>
                    Sign up
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
                    disabled={isExecuting}
                >
                    Sign in with Github
                    <FaGithub className="w-5 h-5" />
                </Button>
            </form>
        </Form>
    )
}
