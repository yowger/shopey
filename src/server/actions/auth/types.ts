type ObjectValues<T> = T[keyof T]

export const REGISTER_ERROR = {
    USER_EXISTS: "USER_EXISTS",
    REGISTRATION_ERROR: "REGISTRATION_ERROR",
} as const

export type RegisterError = ObjectValues<typeof REGISTER_ERROR>
