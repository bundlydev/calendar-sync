/*
  Warnings:

  - Added the required column `credentialId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "credentialId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "EventSynced_eventId_idx" ON "EventSynced"("eventId");

-- CreateIndex
CREATE INDEX "EventSynced_credentialId_idx" ON "EventSynced"("credentialId");

-- CreateIndex
CREATE INDEX "EventSynced_originEventId_idx" ON "EventSynced"("originEventId");

-- CreateIndex
CREATE INDEX "Notification_credentialId_expiration_idx" ON "Notification"("credentialId", "expiration");

-- CreateIndex
CREATE INDEX "Notification_watchUuid_expiration_idx" ON "Notification"("watchUuid", "expiration");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
