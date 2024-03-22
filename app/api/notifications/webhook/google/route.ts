import { NextResponse, type NextRequest } from "next/server";
import { syncEvents } from "@/lib/events/google/sync";
import GoogleNotification from "@/lib/notifications/google";
import { prisma } from "@/lib/prisma";
import z from "zod";

const ZRequestHeadersParamsSchema = z
  .object({
    "x-goog-channel-id": z.string(),
    "x-goog-message-number": z.string(),
    "x-goog-resource-id": z.string(),
    "x-goog-resource-state": z.string(),
    "x-goog-resource-uri": z.string(),
    "x-goog-channel-expiration": z.string().optional(),
    "x-goog-channel-token": z.string().optional(),
  })
  .passthrough();

export const POST = async (req: NextRequest) => {
  // First get the syncTaskId to sync from the request
  const requestHeaders = new Headers(req.headers);
  const requestHeadersParams = Object.fromEntries(requestHeaders.entries());
  const parse = ZRequestHeadersParamsSchema.safeParse(requestHeadersParams);
  if (!parse.success) {
    console.error(parse.error);
    return NextResponse.json({ message: "Invalid request" });
  }
  const { "x-goog-channel-id": id, "x-goog-resource-id": resourceId } =
    parse.data;

  // This id should be our notification id
  // We should use this id to fetch the notification from the database
  // and then process the notification
  // and then return the result of the processing

  const existNotification = await prisma.notification.findFirst({
    where: {
      watchUuid: id,
    },
    include: {
      credential: true,
    },
  });

  if (!existNotification) {
    console.log("Notification not found");
    await new GoogleNotification().stopWatch(id, resourceId);
    return NextResponse.json({ message: "Notification not found" });
  }

  // Find credentialSyncTask
  const calendarSyncTask = await prisma.calendarSyncTask.findFirst({
    where: {
      id: existNotification.calendarSyncTaskId,
    },
  });

  if (!calendarSyncTask) {
    console.log("Calendar sync task not found");
    return NextResponse.json({ message: "Calendar sync task not found" });
  }

  // Process the notification
  const result = await syncEvents(calendarSyncTask.id, calendarSyncTask.userId);

  if (result.status === 404) {
    console.log("Sync events failed");
    return NextResponse.json({ message: "Sync events failed" });
  }

  return NextResponse.json({
    ...result,
  });
};
