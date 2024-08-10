import { createSafeActionClient } from "next-safe-action"

import { BaseError, HttpStatusCodes } from "@/errors/http"

import { GENERIC_ERROR_MESSAGE } from "@/constants/messages/errors"

import logger from "@/utils/logger"

import type { ErrorDetails } from "@/errors/http"

const errorLogger = logger.child({ module: "error" })
const actionLogger = logger.child({ module: "action" })

interface ActionLog {
    durationInMs: number
    clientInput: any
    bindArgsClientInputs: any
    metadata: any
    result: any
}

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: "flattened",
    handleServerErrorLog: (error) => {
        if (error instanceof BaseError) {
            const errorType = error.isOperational
                ? "OPERATIONAL ERROR"
                : "NON-OPERATIONAL ERROR"

            errorLogger.error({
                type: errorType,
                httpStatusCode: error.httpStatusCode,
                message: error.message,
                stack: error.stack,
            })

            return
        }

        errorLogger.fatal({
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
}).use(async (args) => {
    const { next, metadata, clientInput, bindArgsClientInputs, ctx } = args

    const start = Date.now()

    const result = await next({ ctx })

    const end = Date.now()

    const durationInMs = end - start

    const logObject: ActionLog = {
        durationInMs,
        clientInput,
        bindArgsClientInputs,
        metadata,
        result,
    }

    actionLogger.info(logObject)

    return result
})
