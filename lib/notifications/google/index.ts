import GoogleAuth, { type OAuth2Client } from "@/lib/auth/google";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";

interface ICreateWatch {
  calendarId: string;
  credentialId: string;
}

class GoogleNotification {
  private auth: OAuth2Client;

  constructor() {
    this.auth = GoogleAuth.getClientInstance();
  }

  public async createWatch(props: ICreateWatch) {
    const { calendarId, credentialId } = props;
    const calendarApi = google.calendar({
      version: "v3",
      auth: this.auth,
    });

    // Validate notification for that credential exist or is not expired
    const existAlready = await prisma.notification.findFirst({
      where: {
        credentialId,
        expiration: {
          gte: new Date(),
        },
      },
    });

    if (existAlready) {
      return true;
    }

    // Create a new notification

    const createNotification = await prisma.notification.create({
      data: {
        type: "web_hook",
        address: `https://7d37-200-76-22-226.ngrok-free.app/api/notifications/webhook/google`,
        credentialId,
      },
    });

    if (!createNotification) {
      throw new Error("Failed to create a notification");
    }

    const notification = await prisma.notification.findUnique({
      where: { id: createNotification.id },
    });

    if (!notification) {
      throw new Error("Failed to find a notification");
    }

    const res = await calendarApi.events.watch({
      calendarId: calendarId || "primary",
      requestBody: {
        id: notification.watchUuid,
        type: "web_hook",
        address: notification.address,
      },
    });

    if (res.status === 200) {
      await prisma.notification.update({
        where: { id: createNotification.id },
        data: {
          token: res.data.token,
          resourceId: res.data.resourceId,
          expiration: new Date(Number(res.data.expiration)),
        },
      });
      return true;
    }
  }

  public async stopWatch(id: string, resourceId: string) {
    const calendarApi = google.calendar({
      version: "v3",
      auth: this.auth,
    });

    // First we stop then we try to delete the notification

    const res = await calendarApi.channels.stop({
      requestBody: {
        id,
        resourceId,
      },
    });

    try {
      await prisma.notification.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Failed to delete notification", error);
    }

    if (res.status === 200) {
      return true;
    }
  }
}

export default GoogleNotification;
