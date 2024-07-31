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
    runtimeEnv: process.env,
})

export default env
