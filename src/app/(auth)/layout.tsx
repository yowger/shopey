interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="mx-auto w-full flex justify-center max-w-7xl p-6 md:p-12">
            {children}
        </div>
    )
}
