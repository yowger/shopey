import { createSafeActionClient } from "next-safe-action"

import { BaseError, HttpStatusCodes } from "@/errors/http"

import { GENERIC_ERROR_MESSAGE } from "@/constants/messages/errors"

import logger from "@/utils/logger"

import type { ErrorDetails } from "@/errors/http"

const log = logger.child({ module: "error" })

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: "flattened",
    handleServerErrorLog: (error) => {
        if (error instanceof BaseError) {
            const errorType = error.isOperational
                ? "OPERATIONAL ERROR"
                : "NON-OPERATIONAL ERROR"

            log.error({
                type: errorType,
                httpStatusCode: error.httpStatusCode,
                message: error.message,
                stack: error.stack,
            })

            return
        }

        log.fatal({
            type: "SERVER ERROR",
            message: error.message,
            stack: error.stack,
        })
    },
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
