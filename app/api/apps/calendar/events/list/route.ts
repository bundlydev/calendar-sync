import { NextResponse } from "next/server";
import { auth } from "@/auth";
import GoogleAuth from "@/lib/auth/google";
import { monthEnd, monthStart } from "@formkit/tempo";
import { prisma } from "@lib/prisma";
import { google } from "googleapis";
import type { NextAuthRequest } from "next-auth/lib";

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // Read all credentials from DB
  const credentials = await prisma.credential.findMany({
    select: {
      refreshToken: true,
    },
    where: {
      type: "calendar",
      userId: req.auth.user?.id,
    },
  });

  const credential = credentials[0];

  if (!!!credential?.refreshToken) {
    return NextResponse.json({ error: "No credentials found" });
  }

  const validRefreshToken = credentials
    .filter((item) => !!item.refreshToken)
    .map((item) => item.refreshToken as string);

  const results = await Promise.all([
    ...validRefreshToken.map((refreshToken) => processCredential(refreshToken)),
  ]);

  // pick color for each different calendar
  const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink"];

  const filteredResults = results.filter(
    (result) => result.data.items.length > 0,
  );

  const processResults = [];

  filteredResults.forEach((result, index) => {
    result.data.items.forEach((event) => {
      const { summary, start, end } = event;

      if (start?.dateTime) {
        processResults.push({
          title: summary,
          start: start.dateTime,
          end: end.dateTime,
          time: start?.timeZone,
          color: colors[index],
        });
      }
    });
  });

  // FlatMap results
  const events = processResults.flatMap((result) => result);

  return NextResponse.json({ events });
});

const processCredential = async (refreshToken: string) => {
  const authClient = new GoogleAuth();
  // @TODO: fix as string
  await authClient.refreshAccessToken(refreshToken);

  const calendar = google.calendar({
    version: "v3",
    auth: authClient.getClientInstance(),
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
