import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import VerifyUserForm from "@/components/forms/auth/verify"

export default function page() {
    return (
        <div className="flex justify-center">
            <Card className="w-full md:w-2/3 lg:w-1/2">
                <CardHeader>
                    <CardTitle>Verify user</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <VerifyUserForm />
                </CardContent>
            </Card>
        </div>
    )
}
