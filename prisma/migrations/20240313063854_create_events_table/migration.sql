-- CreateTable
CREATE TABLE "EventSynced" (
    "id" TEXT NOT NULL,
    "eventUid" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,

    CONSTRAINT "EventSynced_pkey" PRIMARY KEY ("id")
);
