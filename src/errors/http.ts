export enum HttpStatusCodes {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}

export type ErrorId = string | undefined

export interface ErrorDetails {
    id?: ErrorId
    name: string
    description: string
    httpStatusCode: HttpStatusCodes
    isOperational: boolean
}

export class BaseError extends Error {
    public readonly id: ErrorId
    public readonly httpStatusCode: HttpStatusCodes
    public readonly isOperational: boolean

    constructor({
        id = undefined,
        name,
        description,
        httpStatusCode,
        isOperational,
    }: ErrorDetails) {
        super(description)

        Object.setPrototypeOf(this, new.target.prototype)
        this.id = id
        this.name = name
        this.httpStatusCode = httpStatusCode
        this.isOperational = isOperational

        Error.captureStackTrace(this)
    }
}

export type VariantErrorDetails = Partial<
    Pick<ErrorDetails, "id" | "description">
>

export class BadRequestError extends BaseError {
    constructor(details?: VariantErrorDetails) {
        const { id, description = "Bad request" } = details || {}

        super({
            id,
            name: "BadRequestError",
            description: description,
            httpStatusCode: HttpStatusCodes.BAD_REQUEST,
            isOperational: true,
        })
    }
}

export class UnauthorizedError extends BaseError {
    constructor(details?: VariantErrorDetails) {
        const { id, description = "Unauthorized access." } = details || {}

        super({
            id,
            name: "UnauthorizedError",
            description,
            httpStatusCode: HttpStatusCodes.UNAUTHORIZED,
            isOperational: true,
        })
    }
}

export class ForbiddenError extends BaseError {
    constructor(details?: VariantErrorDetails) {
        const { id, description = "Access forbidden." } = details || {}

        super({
            id,
            name: "ForbiddenError",
            description,
            httpStatusCode: HttpStatusCodes.FORBIDDEN,
            isOperational: true,
        })
    }
}

export class NotFoundError extends BaseError {
    constructor(details: VariantErrorDetails) {
        const { id, description = "Resource not found." } = details || {}

        super({
            id,
            name: "NotFoundError",
            description,
            httpStatusCode: HttpStatusCodes.NOT_FOUND,
            isOperational: true,
        })
    }
}

export class ConflictError extends BaseError {
    constructor(details?: VariantErrorDetails) {
        const { id, description = "Request conflict." } = details || {}

        super({
            id,
            name: "ConflictError",
            description,
            httpStatusCode: HttpStatusCodes.CONFLICT,
            isOperational: true,
        })
    }
}

export class InternalServerError extends BaseError {
    constructor(details?: VariantErrorDetails) {
        const { id, description = "Server error." } = details || {}

        super({
            id,
            name: "InternalServerError",
            description,
            httpStatusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            isOperational: false,
        })
    }
}
