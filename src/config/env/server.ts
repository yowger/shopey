import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const env = createEnv({
    server: {
        AUTH_DRIZZLE_URL: z.string().url(),
        AUTH_SECRET: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        // GOOGLE_CLIENT_ID: z.string().min(1),
        // GOOGLE_CLIENT_SECRET: z.string().min(1),
    },
    runtimeEnv: {
        AUTH_DRIZZLE_URL: process.env.AUTH_DRIZZLE_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        // GOOGLE_CLIENT_ID: process.env,
        // GOOGLE_CLIENT_SECRET: process.env,
    },
})

export default env
