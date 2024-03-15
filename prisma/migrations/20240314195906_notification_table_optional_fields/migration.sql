-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "token" DROP NOT NULL,
ALTER COLUMN "expiration" DROP NOT NULL;
