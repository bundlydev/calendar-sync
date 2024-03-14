import { NextResponse } from "next/server";
import { auth } from "@/auth";
import GoogleAuth from "@/lib/auth/google";
import GoogleEvents from "@/lib/events/google";
import { prisma } from "@/lib/prisma";
import { PrivacyCalendarSyncTaskEnum } from "@prisma/client";
import type { NextAuthRequest } from "next-auth/lib";

import { ZQueryParamsSync } from "./schemas";

export const GET = auth(async (req: NextAuthRequest) => {
  const session = req.auth;
  if (!session) {
    return { status: 401, body: "Unauthorized" };
  }
  const searchParams = req.nextUrl.searchParams;
  const query = Object.fromEntries(searchParams);

  // First get the syncTaskId to sync from the request
  const parse = ZQueryParamsSync.safeParse(query);
  if (!parse.success) {
    return { status: 400, body: "Bad request" };
  }
  const { calendarSyncTaskId } = parse.data;

  // Validate the calendarSyncTaskId against the user's session
  const calendarSyncTask = await prisma.calendarSyncTask.findFirst({
    where: {
      id: calendarSyncTaskId,
      userId: session.user?.id,
    },
  });

  if (!calendarSyncTask) {
    return { status: 404, body: "Not found calendarSyncTaskId" };
  }

  // Start the sync process
  // Setting up the rules for this sync
  // 1. Define the number of days to sync 40 days from now
  // 2. Fetch the events from the toCredential calendar
  // 3. Write the events to the fromCredential calendar
  // 4. Return a success response

  const daysToSync = 40;

  // Get user credential
  const credential = await prisma.credential.findFirst({
    where: {
      userId: session.user?.id,
      id: calendarSyncTask.sourceCredentialId,
    },
  });

  if (
    !credential ||
    !credential.token ||
    !credential.refreshToken ||
    !credential.expiresAt
  ) {
    return { status: 404, body: "Not found Credential" };
  }

  await GoogleAuth.refreshAccessToken(
    credential.token,
    credential.refreshToken,
    credential.expiresAt,
  );

  const gEvents = new GoogleEvents();
  const events = await gEvents.getEvents({
    timeMin: new Date().toISOString(),
    timeMax: new Date(
      new Date().getTime() + daysToSync * 24 * 60 * 60 * 1000,
    ).toISOString(),
    maxResults: 2,
  });

  // Now we have the events, we can write them to the destination calendar
  // Pickup the destination calendar credential
  const credentialTo = await prisma.credential.findFirst({
    where: {
      userId: session.user?.id,
      id: calendarSyncTask.toCredentialId,
    },
  });
  await GoogleAuth.refreshAccessToken(
    credentialTo?.token,
    credentialTo?.refreshToken,
    credentialTo?.expiresAt,
  );

  // now loop through the events and create them in the destination calendar
  const loop = events.data.items.map(async (event) => {
    return gEvents.createEvent({
      privacy: googlePrivacyTransform(calendarSyncTask.privacy),
      summary:
        fineTuneSummaryPrivacy(calendarSyncTask.privacy, event?.summary) ||
        "No summary",
      location: event?.location || "No location",
      description:
        eventDescriptionTransform(event?.description) || "No description",
      start: event?.start || {
        dateTime: new Date().toISOString(),
        timeZone: "UTC",
      },
      end: event?.end || {
        dateTime: new Date().toISOString(),
        timeZone: "UTC",
      },
      attendees: event?.attendees,
      reminders: event?.reminders,
      source: {
        title: "Calendsync.com",
        url: "https://calendsync.com",
      },
      colorId: calendarSyncTask.color || "#0000FF",
      credentialId: calendarSyncTask.sourceCredentialId,
    });
  });
  await Promise.all(loop);

  return NextResponse.json({
    success: true,
    message: "Sync completed",
    data: {
      // events: events.data.items,
    },
  });
});

const fineTuneSummaryPrivacy = (
  privacy: PrivacyCalendarSyncTaskEnum,
  summary: string,
) => {
  if (privacy === PrivacyCalendarSyncTaskEnum.Personal) {
    return `Personal Commitment 📅`;
  }
  if (privacy === PrivacyCalendarSyncTaskEnum.Busy) {
    return `Busy Time 🕒`;
  }
  if (privacy === PrivacyCalendarSyncTaskEnum.Partial) {
    return summary;
  }

  return summary;
};

const googlePrivacyTransform = (privacy: PrivacyCalendarSyncTaskEnum) => {
  if (
    privacy === PrivacyCalendarSyncTaskEnum.Personal ||
    privacy === PrivacyCalendarSyncTaskEnum.Busy
  ) {
    return `private`;
  }

  if (privacy === PrivacyCalendarSyncTaskEnum.Partial) {
    return "default";
  }
};

const eventDescriptionTransform = (description: string) => {
  return `${
    description || "No description"
  }\n\n<i>Synced from Calendsync.com</i>`;
};
