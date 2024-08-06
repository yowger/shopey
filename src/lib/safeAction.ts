import { createSafeActionClient } from "next-safe-action"

import { BaseError } from "@/errors/http"

import { GENERIC_ERROR_MESSAGE } from "@/constants/messages/errors"

import type { ErrorDetails } from "@/errors/http"

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: "flattened",
    handleReturnedServerError(error) {
        if (error instanceof BaseError) {
            const { name, message, httpStatusCode, isOperational } = error

            return {
                name,
                description: message,
                httpStatusCode,
                isOperational,
            } as ErrorDetails
        }

        return GENERIC_ERROR_MESSAGE
    },
})
