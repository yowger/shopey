import { actionClient } from "./public"
import { auth } from "@/server/auth"

export const authActionClient = actionClient.use(async (args) => {
    const { next } = args

    const session = await auth()

    if (!session || !session.user.sub) {
        throw new Error("Session not found or valid.")
    }

    return next({ ctx: { userId: session.user.sub } })
})
