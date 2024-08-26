import { timestamp, pgTable, text, pgEnum } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const RoleEnum = pgEnum("roles", ["user", "admin"])

export const usersSchema = pgTable("user", {
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
