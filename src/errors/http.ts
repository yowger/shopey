export enum HttpStatusCodes {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}

export interface ErrorDetails {
    name: string
    description: string
    httpStatusCode: HttpStatusCodes
    isOperational: boolean
}

export class BaseError extends Error {
    public readonly httpStatusCode: HttpStatusCodes
    public readonly isOperational: boolean

    constructor({
        name,
        description,
        httpStatusCode,
        isOperational,
    }: ErrorDetails) {
        super(description)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = name
        this.httpStatusCode = httpStatusCode
        this.isOperational = isOperational

        Error.captureStackTrace(this)
    }
}

export class BadRequestError extends BaseError {
    constructor(description = "Bad request.") {
        super({
            name: "BadRequestError",
            description,
            httpStatusCode: HttpStatusCodes.BAD_REQUEST,
            isOperational: true,
        })
    }
}

export class UnauthorizedError extends BaseError {
    constructor(description = "Unauthorized access.") {
        super({
            name: "UnauthorizedError",
            description,
            httpStatusCode: HttpStatusCodes.UNAUTHORIZED,
            isOperational: true,
        })
    }
}

export class ForbiddenError extends BaseError {
    constructor(description = "Access forbidden.") {
        super({
            name: "ForbiddenError",
            description,
            httpStatusCode: HttpStatusCodes.FORBIDDEN,
            isOperational: true,
        })
    }
}

export class NotFoundError extends BaseError {
    constructor(description = "Resource not found.") {
        super({
            name: "NotFoundError",
            description,
            httpStatusCode: HttpStatusCodes.NOT_FOUND,
            isOperational: true,
        })
    }
}

export class ConflictError extends BaseError {
    constructor(description = "Request conflict.") {
        super({
            name: "ConflictError",
            description,
            httpStatusCode: HttpStatusCodes.CONFLICT,
            isOperational: true,
        })
    }
}

export class InternalServerError extends BaseError {
    constructor(description = "Server error.") {
        super({
            name: "InternalServerError",
            description,
            httpStatusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            isOperational: true,
        })
    }
}
