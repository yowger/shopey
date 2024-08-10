import pino from "pino"

import env from "@/config/env/server"

import type { Logger } from "pino"

const redactPaths: string[] = [
    "*.name",
    "*.email",
    "*.password",
    "*.confirmPassword",
    "result.parsedInput.name",
    "result.parsedInput.email",
    "result.parsedInput.password",
    "result.parsedInput.confirmPassword",
]

const productionLoggerOptions: pino.LoggerOptions = {
    level: "warn",
    redact: {
        paths: redactPaths,
        censor: "[REDACTED]",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
}

const developmentLoggerOptions: pino.LoggerOptions = {
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
    formatters: {
        bindings: (bindings) => ({
            pid: bindings.pid,
            host: bindings.hostname,
        }),
    },
    level: "debug",
    redact: {
        paths: redactPaths,
        censor: "[REDACTED]",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
}

const logger: Logger = pino(
    env.NODE_ENV === "production"
        ? productionLoggerOptions
        : developmentLoggerOptions
)

export default logger
