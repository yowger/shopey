import logger from ".."

export const actionLogger = logger.child({ module: "action" })

export interface ActionLog {
    durationInMs: number
    clientInput: any
    bindArgsClientInputs: any
    metadata: any
    result: any
}

export function logAction(log: ActionLog): void {
    actionLogger.info(log)
}
