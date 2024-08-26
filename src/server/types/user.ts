import { usersSchema } from "../schema/user"

export type User = typeof usersSchema.$inferSelect
