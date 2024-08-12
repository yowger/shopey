import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    pgEnum,
} from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

import type { AdapterAccount } from "next-auth/adapters"

export const RoleEnum = pgEnum("roles", ["user", "admin"])

export const users = pgTable("user", {
    id: text("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    role: RoleEnum("roles").default("user"),
})

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
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

export const otp = pgTable(
    "otp",
    {
        id: text("id")
            .notNull()
            .$defaultFn(() => createId()),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        code: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (otp) => ({
        compoundKey: primaryKey({
            columns: [otp.id, otp.code, otp.userId],
        }),
    })
)
