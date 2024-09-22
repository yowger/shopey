import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),
        AUTH_DRIZZLE_URL: z.string().url(),
        AUTH_SECRET: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        RESEND_API_KEY: z.string().min(1),
        UPLOADTHING_SECRET: z.string().min(1),
        UPLOADTHING_APP_ID: z.string().min(1),
        UPLOADTHING_TOKEN: z.string().min(1),
        // GOOGLE_CLIENT_ID: z.string().min(1),
        // GOOGLE_CLIENT_SECRET: z.string().min(1),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        AUTH_DRIZZLE_URL: process.env.AUTH_DRIZZLE_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
        UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
        UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
        // GOOGLE_CLIENT_ID: process.env,
        // GOOGLE_CLIENT_SECRET: process.env,
    },
})

export default env
