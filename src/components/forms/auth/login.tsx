"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { LoginSchema } from "@/schemas/auth/login"

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

export default function LoginForm() {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        console.log("🚀 ~ onSubmit ~ values:", values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-2.5">
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
                </div>

                <Link
                    className="text-sm font-bold text-blue-600 inline-block"
                    href="/auth/reset"
                >
                    Forgot your password
                </Link>

                <Button type="submit" className="w-full mt-6 mb-2">
                    Sign in
                </Button>

                <p className="line-text text-center mt-4">or continue with</p>

                <Button
                    className="flex gap-4 w-full mt-6"
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
