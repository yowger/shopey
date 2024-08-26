import { timestamp, pgTable, text, primaryKey } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

import { usersSchema } from "./user"

export const otpSchema = pgTable(
    "otp",
    {
        id: text("id")
            .notNull()
            .$defaultFn(() => createId()),
        userId: text("userId")
            .notNull()
            .references(() => usersSchema.id, { onDelete: "cascade" }),
        code: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (otp) => ({
        compoundKey: primaryKey({
            columns: [otp.id, otp.code, otp.userId],
        }),
    })
)
