import GoogleAuth, { type OAuth2Client } from "@/lib/auth/google";
import EventsService from "@/lib/services/db/events";
// import EventsService from "@/lib/services/db/events";
import { google } from "googleapis";

interface IGoogleEventsProps {
  maxResults: number;
  timeMin: string;
  timeMax: string;
}

class GoogleEvents {
  private auth: OAuth2Client;
  constructor() {
    this.auth = GoogleAuth.getClientInstance();
  }

  public async getEvents(props: IGoogleEventsProps) {
    const {
      maxResults = 10,
      timeMin = new Date().toISOString(),
      timeMax,
    } = props;

    const calendar = google.calendar({
      version: "v3",
      auth: this.auth,
    });
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });
    return events;
  }

  public async createEvent({
    summary,
    location,
    description,
    start,
    end,
    source,
    colorId,
    credentialId,
    reminders,
  }: {
    summary: string;
    location: string;
    description: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
    attendees?: string[] | never[];
    reminders?: {
      useDefault: boolean;
      overrides: {
        method: string;
        minutes: number;
      }[];
    };
    source: {
      title: string;
      url: string;
    };
    colorId: string;
    credentialId: string;
  }) {
    const calendar = google.calendar({
      version: "v3",
      auth: this.auth,
    });
    const event = {
      summary,
      location,
      description,
      start,
      end,
      source,
      // colorId,
      // recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      // attendees: [],
      reminders,
    };
    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    console.log({ data: res.data });
    console.log("Event created: %s", res.data.htmlLink);
    // save the event id to the database
    await new EventsService().saveEvent({
      eventUid: res.data.iCalUID,
      eventId: res.data.id,
      credentialId,
    });
    return res;
  }
}

export default GoogleEvents;

// data: {
//   kind: 'calendar#event',
//   etag: '"3420796624130000"',
//   id: 'gf7ulv1t03ecauc6a2rgpgcc3g',
//   status: 'confirmed',
//   htmlLink: 'https://www.google.com/calendar/event?eid=Z2Y3dWx2MXQwM2VjYXVjNmEycmdwZ2NjM2cgYWxhbmRvbGVyYXRpYmlhQG0',
//   created: '2024-03-14T06:38:32.000Z',
//   updated: '2024-03-14T06:38:32.065Z',
//   summary: 'AI Bootcamp 5pm Mar by Matheus Pagani 24Q1',
//   description: 'No description',
//   location: 'https://us02web.zoom.us/j/86763996930',
//   creator: { email: 'alandoleratibia@gmail.com', self: true },
//   organizer: { email: 'alandoleratibia@gmail.com', self: true },
//   start: {
//     dateTime: '2024-03-19T10:00:00-07:00',
//     timeZone: 'Europe/London'
//   },
//   end: {
//     dateTime: '2024-03-19T11:30:00-07:00',
//     timeZone: 'Europe/London'
//   },
//   iCalUID: 'gf7ulv1t03ecauc6a2rgpgcc3g@google.com',
//   sequence: 0,
//   reminders: { useDefault: true },
//   eventType: 'default'
// }
