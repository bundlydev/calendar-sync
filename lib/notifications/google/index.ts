import GoogleAuth, { type OAuth2Client } from "@/lib/auth/google";
import { prisma } from "@/lib/prisma";
import { env } from "@/src/env.mjs";
import { addMinute } from "@formkit/tempo";
import { google } from "googleapis";

interface ICreateWatch {
  calendarId: string;
  credentialId: string;
  calendarSyncTaskId: string;
}

class GoogleNotification {
  private auth: OAuth2Client;

  constructor() {
    this.auth = GoogleAuth.getClientInstance();
  }

  public async createWatch(props: ICreateWatch) {
    if (env.GOOGLE_NOTIFICATIONS_ENABLED !== "true") {
      return true;
    }
    const expirationOffsetUnixDate = addMinute(
      new Date(),
      Number(env.GOOGLE_NOTIFICATIONS_EXPIRATION_MINUTES || 60),
    )
      .getTime()
      .toString();
    const { calendarId, credentialId, calendarSyncTaskId } = props;
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

    // @TODO: prisma transaction

    const createNotification = await prisma.notification.create({
      data: {
        type: "web_hook",
        address: `https://7d37-200-76-22-226.ngrok-free.app/api/notifications/webhook/google`,
        credentialId,
        calendarSyncTaskId,
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
    console.log(expirationOffsetUnixDate);
    const res = await calendarApi.events.watch({
      calendarId: calendarId || "primary",
      requestBody: {
        id: notification.watchUuid,
        type: "web_hook",
        address: notification.address,
        expiration: expirationOffsetUnixDate,
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

    const credential = await prisma.credential.findFirst({
      where: {
        id: "clts8b6by000di1z4ih25bv9w",
      },
    });
    if (
      !credential ||
      !credential.token ||
      !credential.refreshToken ||
      !credential.expiresAt
    ) {
      throw new Error("Credential not found");
    }

    await GoogleAuth.refreshAccessToken(
      credential.token,
      credential.refreshToken,
      credential.expiresAt,
    );

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
