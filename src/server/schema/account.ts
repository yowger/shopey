import { pgTable, text, pgEnum, integer, primaryKey } from "drizzle-orm/pg-core"

import { usersSchema } from "./user"

import type { AdapterAccount } from "next-auth/adapters"

export const RoleEnum = pgEnum("roles", ["user", "admin"])

export const accountsSchema = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => usersSchema.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)
