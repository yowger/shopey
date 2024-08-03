import Link from "next/link"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import LoginForm from "@/components/forms/auth/login"

export default function page() {
    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Log in to your account</CardTitle>
                <CardDescription>
                    Welcome back! Select method to log in
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
            <CardFooter className="flex justify-center mt-3">
                <span className="text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-600 font-bold">
                        Create an account
                    </Link>
                </span>
            </CardFooter>
        </Card>
    )
}
