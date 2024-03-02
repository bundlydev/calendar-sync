import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@lib/prisma";
import { google } from "googleapis";
import type { NextAuthRequest } from "next-auth/lib";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth(req, res);

  if (session) {
    // Signed in
    console.log("ReqAuth", JSON.stringify(session, null, 2));
    // return res.json("This is protected content.");
  } else {
    // Not Signed in
    // res.status(401);
    return NextResponse.json({ auth: false });
  }

  // Read credentials from DB
  const credential = await prisma.credential.findFirst({
    where: {
      userId: session.user?.id,
    },
  });

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  oauth2Client.setCredentials({
    access_token: credential?.accessToken,
    refresh_token: credential?.refreshToken,
    scope: credential?.scope,
    token_type: credential?.tokenType,
    expiry_date: credential?.expiryDate,
  });

  console.log({ credential });

  const calendar = google.calendar({
    version: "v3",
    auth: {},
  });
  console.log({ calendar });
  const events = await calendar.events.list({
    calendarId: "primary",
  });
  return NextResponse.json({ events });
};
