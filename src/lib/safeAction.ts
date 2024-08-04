import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient({
    handleReturnedServerError(error) {
        // TODO: log/alert
    },
})
