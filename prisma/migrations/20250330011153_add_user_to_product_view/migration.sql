/*
  Warnings:

  - Added the required column `user_id` to the `product_views` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_views" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
