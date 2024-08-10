import pino from "pino"

import env from "@/config/env/server"

import type { Logger } from "pino"

const productionLoggerOptions: pino.LoggerOptions = {
    level: "warn",
    redact: {
        paths: ["*.name", "*.email", "*.password", "*.confirmPassword"],
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
        paths: ["*.name", "*.email", "*.password", "*.confirmPassword"],
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
