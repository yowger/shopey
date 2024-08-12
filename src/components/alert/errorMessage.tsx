import clsx from "clsx"

import { MdError } from "react-icons/md"

interface ErrorMessageProps {
    message: string | null
    className?: string
}

export default function ErrorMessage(props: ErrorMessageProps) {
    const { message, className } = props

    if (!message) return null

    return (
        <div
            className={clsx(
                "bg-destructive/25 flex text-xs font-medium items-center gap-2 text-secondary-foreground p-3 rounded-md",
                className
            )}
        >
            <MdError className="size-5" />
            <p>{message}</p>
        </div>
    )
}
