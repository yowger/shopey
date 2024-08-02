"use client"

import Link from "next/link"
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
export default function RegisterForm() {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    })

    return (
        <Form {...form}>
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
                name="email"
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

            <Button size="sm" className="px-0" variant="link" asChild>
                <Link href="/password/reset">Forgot your password</Link>
            </Button>

            <Button className="w-full my-2">Register</Button>
        </Form>
    )
}
