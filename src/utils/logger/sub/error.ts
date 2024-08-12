import logger from ".."

export const errorLogger = logger.child({ module: "error" })

export type ErrorLog = {
    operational: boolean
    context?: Record<string, unknown>
    name: string
    message: string
    stack?: string
}

export function logError(
    error: Error,
    operational: boolean,
    context?: Record<string, unknown>
): void {
    const errorLog: ErrorLog = {
        operational,
        context,
        name: error.name,
        message: error.message,
        stack: error.stack,
    }

    errorLogger.error(errorLog)
}
