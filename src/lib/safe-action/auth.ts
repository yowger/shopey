import { actionClient } from "./public"
import { auth } from "@/server/auth"

export const authActionClient = actionClient.use(async (args) => {
    const { next } = args

    const session = await auth()
    if (!session) {
        throw new Error("Session not found.")
    }

    const { user } = session
    if (!user.sub) {
        throw new Error("Session is not valid.")
    }

    return next({ ctx: { userId: user.sub } })
})
