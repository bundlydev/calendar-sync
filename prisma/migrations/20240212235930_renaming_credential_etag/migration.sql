/*
  Warnings:

  - You are about to drop the column `eTag` on the `Credential` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "eTag",
ADD COLUMN     "etag" TEXT;
