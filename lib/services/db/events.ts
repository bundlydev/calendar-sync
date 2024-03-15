import { prisma } from "@/lib/prisma";
import { dayEnd, dayStart } from "@formkit/tempo";
import { type PrismaClient } from "@prisma/client";
import type { calendar_v3 } from "googleapis";

interface ISaveEvents extends calendar_v3.Schema$Event {
  eventId: string;
  credentialId: string;
  originEvent: calendar_v3.Schema$Event & { raw: string };
}

class EventsService {
  private db: PrismaClient;
  constructor() {
    this.db = prisma;
  }

  async saveEvent(props: ISaveEvents) {
    const { id: eventUid, eventId, credentialId, originEvent } = props;

    // TS safe
    if (!eventUid || !originEvent?.iCalUID || !originEvent?.id) {
      return;
    }
    return await this.db.eventSynced.create({
      data: {
        eventUid,
        eventId,
        credentialId,
        originStart: fixTimeForAllDayEvent(originEvent.start, "start").dateTime,
        originStartTimezone: fixTimeForAllDayEvent(originEvent.start, "start")
          .timeZone,
        originEnd: fixTimeForAllDayEvent(originEvent.end, "end").dateTime,
        originEndTimezone: fixTimeForAllDayEvent(originEvent.end, "end")
          .timeZone,
        originEventUid: originEvent.iCalUID,
        originEventId: originEvent.id,
        originRaw: originEvent.raw,
      },
    });
  }

  async deleteEvent(eventSyncedId: string) {
    return this.db.eventSynced.delete({
      where: {
        id: eventSyncedId,
      },
    });
  }
}

export const fixTimeForAllDayEvent = (
  time: calendar_v3.Schema$Event["start"],
  startOrEnd: "start" | "end",
) => {
  if (time?.date) {
    return {
      dateTime:
        startOrEnd === "start"
          ? dayStart(time.date).toISOString()
          : dayEnd(time.date).toISOString(),
      timeZone: "UTC",
    };
  }
  return {
    dateTime: time?.dateTime ? time?.dateTime : "",
    timeZone: time?.timeZone ? time?.timeZone : "UTC",
  };
};

export default EventsService;
