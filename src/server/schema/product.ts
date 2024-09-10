import { relations } from "drizzle-orm"
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

export const productVariantsSchema = pgTable("productVariants", {
    id: serial("id").primaryKey(),
    color: text("color").notNull(),
    productType: text("productType").notNull(),
    updated: timestamp("updated").defaultNow(),
    productId: serial("productId")
        .notNull()
        .references(() => productsSchema.id, { onDelete: "cascade" }),
})

export const productVariantImagesSchema = pgTable("productVariants", {
    id: serial("id").primaryKey(),
    url: text("url").notNull(),
    size: real("size").notNull(),
    name: text("name").notNull(),
    order: real("order").notNull(),
    variantId: serial("variantID")
        .notNull()
        .references(() => productVariantsSchema.id, { onDelete: "cascade" }),
})

export const productVariantTagsSchema = pgTable("variantTags", {
    id: serial("id").primaryKey(),
    tag: text("tag").notNull(),
    variantId: serial("variantId")
        .notNull()
        .references(() => productVariantsSchema.id, { onDelete: "cascade" }),
})

export const productRelations = relations(productsSchema, ({ many }) => ({
    productVariants: many(productVariantsSchema, {
        relationName: "productVariants",
    }),
}))

export const productVariantsRelations = relations(
    productVariantsSchema,
    ({ many, one }) => ({
        product: one(productsSchema, {
            fields: [productVariantsSchema.productId],
            references: [productsSchema.id],
            relationName: "productVariants",
        }),
        variantImages: many(productVariantImagesSchema, {
            relationName: "variantImages",
        }),
        variantTags: many(productVariantTagsSchema, {
            relationName: "variantTags",
        }),
    })
)

export const variantImagesRelations = relations(
    productVariantImagesSchema,
    ({ one }) => ({
        productVariants: one(productVariantsSchema, {
            fields: [productVariantImagesSchema.variantId],
            references: [productVariantsSchema.id],
            relationName: "variantImages",
        }),
    })
)

export const variantTagsRelations = relations(
    productVariantTagsSchema,
    ({ one }) => ({
        productVariants: one(productVariantsSchema, {
            fields: [productVariantTagsSchema.variantId],
            references: [productVariantsSchema.id],
            relationName: "variantTags",
        }),
    })
)
