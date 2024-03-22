import { NextResponse } from "next/server";
import GoogleAuth from "@/lib/auth/google";
import { env } from "@/src/env.mjs";

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

export function GET() {
  const calendsyncWebsiteURL = env.CALENDAR_SYNC_WEB_URL;
  // const clientId = env.AUTH_GOOGLE_ID;
  // const clientSecret = env.AUTH_GOOGLE_SECRET;
  const redirectUri = `${calendsyncWebsiteURL}/api/integrations/googlecalendar/callback`;
  // const oauth2Client = new google.auth.OAuth2(
  //   clientId,
  //   clientSecret,
  //   redirectUri,
  // );

  GoogleAuth.getClientInstance();
  const authUrl = GoogleAuth.getAuthUrl(scopes, redirectUri);

  // const authUrl = oauth2Client.generateAuthUrl({
  //   // 'online' (default) or 'offline' (gets refresh_token)
  //   access_type: "offline",
  //   // If you only need one scope you can pass it as a string
  //   scope: scopes,
  //   // Enable incremental authorization. Recommended as a best practice.
  //   include_granted_scopes: true,
  //   // Consent should be here otherwise google will not return refresh token
  //   prompt: "consent",
  // });
  return NextResponse.redirect(authUrl);
}
