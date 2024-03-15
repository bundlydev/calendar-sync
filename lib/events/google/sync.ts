import GoogleAuth from "@/lib/auth/google";
import GoogleNotification from "@/lib/notifications/google";
import { prisma } from "@/lib/prisma";
import { PrivacyCalendarSyncTaskEnum } from "@prisma/client";

import GoogleEvents from ".";

export const syncEvents = async (
  calendarSyncTaskId: string,
  userId: string,
) => {
  // Validate the calendarSyncTaskId against the user's session
  const calendarSyncTask = await prisma.calendarSyncTask.findFirst({
    where: {
      id: calendarSyncTaskId,
      userId: userId,
    },
  });

  if (!calendarSyncTask) {
    return { status: 404, body: "Not found calendarSyncTaskId" };
  }

  // @TODO: config from settings
  const daysToSync = 40;

  // Get user credential
  const credential = await prisma.credential.findFirst({
    where: {
      userId: userId,
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

  // Call the refresh token to access the user's calendar
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
    // @NOTE: maxResults can be up to 2500
    maxResults: 2,
  });

  // Now we have the events, we can write them to the destination calendar
  // Pickup the destination calendar credential to write the events to destination calendar
  const credentialTo = await prisma.credential.findFirst({
    where: {
      userId: userId,
      id: calendarSyncTask.toCredentialId,
    },
  });

  // TS safe
  if (
    !credentialTo ||
    !credentialTo?.token ||
    !credentialTo?.refreshToken ||
    !credentialTo?.expiresAt
  ) {
    return { status: 404, body: "Not found credentialTo" };
  }

  // Setup the destination calendar credentials
  await GoogleAuth.refreshAccessToken(
    credentialTo?.token,
    credentialTo?.refreshToken,
    credentialTo?.expiresAt,
  );

  // We need to validate events don't exist in eventSynced table originEventId field
  // If they exist, we skip them

  const eventsIdsOnlyString =
    events.data.items?.filter((item) => typeof item?.id === "string") || [];
  const eventsIds = eventsIdsOnlyString
    .filter((item): item is { id: string } => typeof item?.id === "string")
    .map((event) => event.id);

  const existingEvents = await prisma.eventSynced.findMany({
    where: {
      originEventId: {
        in: eventsIds,
      },
    },
  });

  const existingOriginEventsId = existingEvents.map(
    (event) => event.originEventId,
  );

  const eventsToCreate = eventsIdsOnlyString?.filter(
    (event) => event?.id && !existingOriginEventsId.includes(event?.id),
  );

  // now loop through the events and create them in the destination calendar
  const loop = eventsToCreate.map(async (event) => {
    return gEvents.createEvent({
      visibility: filterGooglePrivacy(calendarSyncTask.privacy),
      summary:
        filterSummaryTextWithPrivacyConfig(
          calendarSyncTask.privacy,
          event?.summary || "",
        ) || "No summary",
      location: event?.location || "No location",
      description: event?.description
        ? filterDescription(event?.description)
        : "No description",
      start: event?.start,
      end: event?.end,
      attendees: event?.attendees,
      reminders: event?.reminders,
      source: {
        title: "Calendsync.com",
        url: "https://calendsync.com",
      },
      colorId: calendarSyncTask.color || "#0000FF",
      credentialId: calendarSyncTask.sourceCredentialId,
      originEvent: {
        id: event.id,
        iCalUID: event.iCalUID,
        start: {
          dateTime: event.start?.dateTime,
          timeZone: event.start?.timeZone,
        },
        end: {
          dateTime: event.end?.dateTime,
          timeZone: event.end?.timeZone,
        },
        raw: JSON.stringify(event),
      },
    });
  });

  await Promise.all(loop);

  const watchers = new GoogleNotification();
  const webhookResult = await watchers.createWatch({
    calendarId: "primary",
    credentialId: calendarSyncTask.sourceCredentialId,
  });

  return {
    status: 200,
    success: true,
    webhookResult: !!webhookResult,
  };
};

const filterSummaryTextWithPrivacyConfig = (
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

const filterGooglePrivacy = (privacy: PrivacyCalendarSyncTaskEnum) => {
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

const filterDescription = (description: string) => {
  return `${
    description || "No description"
  }\n\n<i>Synced from Calendsync.com</i>`;
};

// const eventDiff = (
//   originEvent: {
//     start: string;
//     startTimezone: string;
//     end: string;
//     endTimezone: string;
//   },
//   event: {
//     start: {
//       dateTime: string;
//       timeZone: string;
//     };
//     end: {
//       dateTime: string;
//       timeZone: string;
//     };
//   },
// ) => {
//   return (
//     originEvent.start !== event.start.dateTime ||
//     originEvent.startTimezone !== event.start.timeZone ||
//     originEvent.end !== event.end.dateTime ||
//     originEvent.endTimezone !== event.end.timeZone
//   );
// };
