import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"

import schema from "@/server/schema"

import env from "@/config/env/server"

const sql = neon(env.AUTH_DRIZZLE_URL)

export const db = drizzle(sql, { schema })
