import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
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
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
            <CardFooter className="flex justify-between">
                <span className="text-sm">
                    Already have an account? {" "}
                    <Link href="/login" className="font-bold">
                        Login
                    </Link>
                </span>
            </CardFooter>
        </Card>
    )
}
