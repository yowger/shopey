interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="mx-auto w-full md:w-2/3 lg:w-1/2 max-w-7xl p-6 md:p-12">
            {children}
        </div>
    )
}
