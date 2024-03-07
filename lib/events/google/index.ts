import GoogleAuth from "@/lib/auth/google";
import { google } from "googleapis";

class GoogleEvents {
  constructor() {}

  public async getEvents() {
    const auth = new GoogleAuth();

    const calendar = google.calendar({
      version: "v3",
      auth: auth.getClientInstance(),
    });
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    return events;
  }
}

export default GoogleEvents;
