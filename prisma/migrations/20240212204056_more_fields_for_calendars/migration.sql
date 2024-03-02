/*
  Warnings:

  - Added the required column `accessRole` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backgroundColor` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorId` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `etag` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foregroundColor` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kind` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primary` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selected` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeZone` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "accessRole" TEXT NOT NULL,
ADD COLUMN     "backgroundColor" TEXT NOT NULL,
ADD COLUMN     "colorId" TEXT NOT NULL,
ADD COLUMN     "etag" TEXT NOT NULL,
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "foregroundColor" TEXT NOT NULL,
ADD COLUMN     "kind" TEXT NOT NULL,
ADD COLUMN     "primary" BOOLEAN NOT NULL,
ADD COLUMN     "selected" BOOLEAN NOT NULL,
ADD COLUMN     "timeZone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Credential" ALTER COLUMN "providerId" SET DATA TYPE TEXT;
