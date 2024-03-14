import { prisma } from "@/lib/prisma";
import { type PrismaClient } from "@prisma/client";

interface ISaveEvents {
  eventUid: string;
  eventId: string;
  credentialId: string;
}

class EventsService {
  private db: PrismaClient;
  constructor() {
    this.db = prisma;
  }

  async saveEvent(props: ISaveEvents) {
    const { eventUid, eventId, credentialId } = props;
    return this.db.eventSynced.create({
      data: {
        eventUid,
        eventId,
        credentialId,
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

export default EventsService;
