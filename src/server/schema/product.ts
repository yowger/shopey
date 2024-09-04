import { timestamp, pgTable, text, real, serial } from "drizzle-orm/pg-core"

export const productsSchema = pgTable("products", {
    id: serial("id").primaryKey(),
    description: text("description").notNull(),
    title: text("title").notNull(),
    created: timestamp("created").notNull().defaultNow(),
    updated: timestamp("updated")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    price: real("price").notNull(),
})
