import GoogleAuth from "@/lib/auth/google";
import { prisma } from "@/lib/prisma";
import { fixTimeForAllDayEvent } from "@/lib/services/db/events";
import { monthEnd, monthStart } from "@formkit/tempo";
import { google, type calendar_v3 } from "googleapis";

export const list = async (userId?: string) => {
  // Read all credentials from DB
  const credentials = await prisma.credential.findMany({
    select: {
      token: true,
      refreshToken: true,
      expiresAt: true,
    },
    where: {
      type: "calendar",
      userId: userId,
    },
  });

  const credential = credentials[0];

  if (!credential?.refreshToken) {
    return { status: 400, message: "No credentials found" };
  }

  const validCredentials = credentials.filter((item) => !!item.refreshToken);

  const results = await Promise.all([
    ...validCredentials.map((credential) => {
      // Ts safe
      if (
        !credential ||
        !credential.token ||
        !credential.refreshToken ||
        !credential.expiresAt
      )
        return null;

      return processCredential(
        credential.token,
        credential.refreshToken,
        credential.expiresAt,
      );
    }),
  ]);

  // pick color for each different calendar
  const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink"];

  const filteredResults = results.filter(
    (item) => item?.data?.items && item.data.items.length > 0,
  );

  const processResults: {
    title: calendar_v3.Schema$Event["summary"];
    start: string;
    end: string;
    time: string;
    color: string;
  }[] = [];

  filteredResults.forEach((result, index) => {
    result?.data.items?.length &&
      result.data.items.forEach((event) => {
        const { summary, start, end } = event;

        if (start?.dateTime) {
          processResults.push({
            title: summary,
            start: fixTimeForAllDayEvent(start, "start").dateTime,
            end: fixTimeForAllDayEvent(end, "end").dateTime,
            // @TODO: fix time to timeZone in frontend
            time: fixTimeForAllDayEvent(start, "start").timeZone,
            color: colors[index] || "#0000ff",
          });
        }
      });
  });

  // FlatMap results
  const events = processResults.flatMap((result) => result);

  return {
    status: 200,
    events,
  };
};

const processCredential = async (
  accessToken: string,
  refreshToken: string,
  expiresAt: Date,
) => {
  const authClient = GoogleAuth.getClientInstance();
  // @TODO: fix as string
  await GoogleAuth.refreshAccessToken(accessToken, refreshToken, expiresAt);

  const calendar = google.calendar({
    version: "v3",
    auth: authClient,
  });

  // this month
  const minDate = monthStart(new Date());
  const maxDate = monthEnd(minDate);
  return await calendar.events.list({
    calendarId: "primary",
    timeMin: minDate.toISOString(),
    // One month from now
    timeMax: maxDate.toISOString(),
  });
};
