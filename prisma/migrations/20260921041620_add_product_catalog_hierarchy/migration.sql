-- CreateEnum
CREATE TYPE "SkuLifecycleStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'TEMPORARILY_UNAVAILABLE', 'DISCONTINUED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "extra" JSONB;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "family_id" TEXT,
ADD COLUMN     "sku_lifecycle" "SkuLifecycleStatus",
ADD COLUMN     "variant_label" TEXT;

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_families" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "product_families_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_code_key" ON "product_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_families_code_key" ON "product_families"("code");

-- CreateIndex
CREATE INDEX "products_family_id_idx" ON "products"("family_id");

-- AddForeignKey
ALTER TABLE "product_families" ADD CONSTRAINT "product_families_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "product_families"("id") ON DELETE SET NULL ON UPDATE CASCADE;
