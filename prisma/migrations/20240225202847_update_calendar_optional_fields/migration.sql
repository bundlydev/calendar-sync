/*
  Warnings:

  - You are about to drop the column `providerInternalId` on the `Calendar` table. All the data in the column will be lost.
  - Made the column `externalId` on table `Calendar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Calendar" DROP COLUMN "providerInternalId",
ALTER COLUMN "accessRole" DROP NOT NULL,
ALTER COLUMN "backgroundColor" DROP NOT NULL,
ALTER COLUMN "colorId" DROP NOT NULL,
ALTER COLUMN "etag" DROP NOT NULL,
ALTER COLUMN "externalId" SET NOT NULL,
ALTER COLUMN "foregroundColor" DROP NOT NULL,
ALTER COLUMN "kind" DROP NOT NULL,
ALTER COLUMN "primary" DROP NOT NULL,
ALTER COLUMN "selected" DROP NOT NULL,
ALTER COLUMN "timeZone" DROP NOT NULL;
