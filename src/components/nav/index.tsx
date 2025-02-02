import { SVGProps } from "react"
import Link from "next/link"

import { auth } from "@/server/auth"

import { Button } from "@/components/ui/button"
import Menu from "./user-nav"
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { ThemeToggler } from "../common/theme-toggler"

export default async function Nav() {
    const session = await auth()

    return (
        <header className="flex h-20 w-full shrink-0 items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <Link href="#" prefetch={false}>
                        <MountainIcon className="h-6 w-6" />
                        <span className="sr-only">Company Logo</span>
                    </Link>
                    <div className="grid gap-2 py-6">
                        <Link
                            href="/dashboard"
                            className="flex w-full items-center py-2 text-lg font-semibold"
                            prefetch={false}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/products"
                            className="flex w-full items-center py-2 text-lg font-semibold"
                            prefetch={false}
                        >
                            Products
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
            <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
                <MountainIcon className="h-6 w-6" />
                <span className="sr-only">Company Logo</span>
            </Link>
            <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                    <NavigationMenuLink asChild>
                        <Link
                            href="/dashboard"
                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                            prefetch={false}
                        >
                            Dashboard
                        </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                        <Link
                            href="/dashboard/products"
                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                            prefetch={false}
                        >
                            Products
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-2 ml-auto">
                <ThemeToggler />
                {session && <Menu session={session} />}
            </div>
        </header>
    )
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}

function MountainIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
}
