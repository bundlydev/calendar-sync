import { NextResponse } from "next/server";
import GoogleAuth from "@/lib/auth/google";
import { env } from "@/src/env.mjs";

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

export function GET() {
  const calendsyncWebsiteURL = env.CALENDAR_SYNC_WEB_URL;

  const redirectUri = `${calendsyncWebsiteURL}/api/integrations/googlecalendar/callback`;

  GoogleAuth.getClientInstance();
  const authUrl = GoogleAuth.getAuthUrl(scopes, redirectUri);

  return NextResponse.redirect(authUrl);
}
