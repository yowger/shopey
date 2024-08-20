import { createSafeActionClient } from "next-safe-action"

import { GENERIC_ERROR_MESSAGE } from "@/constants/messages/errors"

import { BaseError } from "@/errors/http"

import { logError } from "@/utils/logger/sub/error"
import { logAction } from "@/utils/logger/sub/action"

import type { ErrorDetails } from "@/errors/http"

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: "flattened",
    handleServerErrorLog: (error) => {
        if (error instanceof BaseError) {
            logError(error, error.isOperational, {
                httpStatusCode: error.httpStatusCode,
            })

            return
        }

        logError(error, false)
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
}).use(async (args) => {
    const { next, metadata, clientInput, bindArgsClientInputs, ctx } = args

    const start = Date.now()

    const result = await next({ ctx })

    const end = Date.now()

    const durationInMs = end - start

    logAction({
        durationInMs,
        clientInput,
        bindArgsClientInputs,
        metadata,
        result,
    })

    return result
})
