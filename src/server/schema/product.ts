import { timestamp, pgTable, text, real, serial } from "drizzle-orm/pg-core"

export const productsSchema = pgTable("products", {
    id: serial("id").primaryKey(),
    description: text("description").notNull(),
    title: text("title").notNull(),
    created: timestamp("created").defaultNow(),
    price: real("price").notNull(),
})
