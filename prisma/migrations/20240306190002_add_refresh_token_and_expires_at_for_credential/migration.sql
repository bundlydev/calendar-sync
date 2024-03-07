-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT;
