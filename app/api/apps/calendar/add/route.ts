import { NextResponse } from "next/server";
import { env } from "@/src/env.mjs";
import { google } from "googleapis";

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

export function GET() {
  const calendsyncWebsiteURL = process.env.CALENDAR_SYNC_WEB_URL;
  const clientId = env.AUTH_GOOGLE_ID;
  const clientSecret = env.AUTH_GOOGLE_SECRET;
  const redirectUri = `${calendsyncWebsiteURL}/api/integrations/googlecalendar/callback`;
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  const authUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    // If you only need one scope you can pass it as a string
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    prompt: "select_account+consent",
  });
  return NextResponse.redirect(authUrl);
}
