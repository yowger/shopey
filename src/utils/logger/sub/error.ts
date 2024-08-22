import logger from ".."

export const errorLogger = logger.child({ module: "error" })

export type ErrorLog = {
    id?: string
    operational: boolean
    context?: Record<string, unknown>
    name: string
    message: string
    stack?: string
}

interface LogError {
    id?: string
    error: Error
    operational: boolean
    context?: Record<string, unknown>
}

export function logError(details: LogError): void {
    const { id, error, context, operational } = details

    const errorLog: ErrorLog = {
        id,
        operational,
        context,
        name: error.name,
        message: error.message,
        stack: error.stack,
    }

    errorLogger.error(errorLog)
}
