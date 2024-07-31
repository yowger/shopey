import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"

dotenv.config({
    path: ".env.local",
})

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/server/schema.ts",
    out: "./src/server/migrations",
    dbCredentials: {
        url: process.env.AUTH_DRIZZLE_URL!,
    },
})
