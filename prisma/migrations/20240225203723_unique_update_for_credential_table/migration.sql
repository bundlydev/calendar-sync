/*
  Warnings:

  - You are about to drop the column `etag` on the `Credential` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,type,providerId,externalId]` on the table `Credential` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Credential_userId_type_providerId_key";

-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "etag",
ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Credential_userId_type_providerId_externalId_key" ON "Credential"("userId", "type", "providerId", "externalId");
