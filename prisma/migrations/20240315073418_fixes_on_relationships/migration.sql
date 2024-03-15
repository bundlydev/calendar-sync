/*
  Warnings:

  - Added the required column `calendarSyncTaskId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "calendarSyncTaskId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_calendarSyncTaskId_fkey" FOREIGN KEY ("calendarSyncTaskId") REFERENCES "CalendarSyncTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
