import clsx from "clsx"

import { MdCheckCircle } from "react-icons/md"

interface SuccessMessageProps {
    message: string | null
    className?: string
}

export default function SuccessMessage(props: SuccessMessageProps) {
    const { message, className } = props

    if (!message) return null

    return (
        <div
            className={clsx(
                "bg-teal-400/25 flex text-xs font-medium items-center gap-2 text-secondary-foreground p-3 rounded-md",
                className
            )}
        >
            <MdCheckCircle className="size-5" />
            <p>{message}</p>
        </div>
    )
}
