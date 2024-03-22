/*
  Warnings:

  - Added the required column `originEnd` to the `EventSynced` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originEndTimezone` to the `EventSynced` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originEventId` to the `EventSynced` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originEventUid` to the `EventSynced` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originStart` to the `EventSynced` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originStartTimezone` to the `EventSynced` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventSynced" ADD COLUMN     "originEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "originEndTimezone" TEXT NOT NULL,
ADD COLUMN     "originEventId" TEXT NOT NULL,
ADD COLUMN     "originEventUid" TEXT NOT NULL,
ADD COLUMN     "originRaw" JSONB,
ADD COLUMN     "originStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "originStartTimezone" TEXT NOT NULL;
