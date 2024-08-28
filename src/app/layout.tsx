import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

import { Toaster } from "@/components/ui/toaster"

import "./globals.css"

import type { Metadata } from "next"
import type { ReactNode } from "react"

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: "Shopey",
    description: "Shopey come and shop",
}

interface RootLayoutProps {
    children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={cn("font-sans antialiased", fontSans.variable)}>
                <div
                    className={
                        "flex-grow min-h-screen max-w-7xl mx-auto px-6 md:px-12"
                    }
                >
                    {children}
                    <Toaster />
                </div>
            </body>
        </html>
    )
}
