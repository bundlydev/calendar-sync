-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "calendarId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
