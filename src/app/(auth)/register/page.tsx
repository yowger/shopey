import Link from "next/link"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import RegisterForm from "@/components/forms/auth/register"

export default function page() {
    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your details to join us
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
            <CardFooter className="flex justify-center mt-3">
                <span className="text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 font-bold">
                        Login
                    </Link>
                </span>
            </CardFooter>
        </Card>
    )
}
