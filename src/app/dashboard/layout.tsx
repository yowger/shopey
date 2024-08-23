import Nav from "@/components/nav"
import type { ReactNode } from "react"

interface DashboardLayout {
    children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayout) {
    return (
        <>
            <Nav />
            {children}
        </>
    )
}
