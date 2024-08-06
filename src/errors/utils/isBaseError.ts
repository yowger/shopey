import { ErrorDetails } from "../http"

export function isBaseError(error: any): error is ErrorDetails {
    return (
        error &&
        typeof error.name === "string" &&
        typeof error.description === "string" &&
        typeof error.httpStatusCode === "number" &&
        typeof error.isOperational === "boolean"
    )
}
