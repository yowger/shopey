CREATE TABLE IF NOT EXISTS "productVariants" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"productType" text NOT NULL,
	"updated" timestamp DEFAULT now(),
	"productId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variantTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"variantId" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "updated" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariants" ADD CONSTRAINT "productVariants_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantId_productVariants_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
