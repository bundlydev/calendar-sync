import { NextResponse, type NextRequest } from "next/server";
import GoogleAuth from "@/lib/auth/google";
import GoogleNotification from "@/lib/notifications/google";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  // const authHeader = req.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json(
  //     { message: "Unauthorized" },
  //     {
  //       status: 401,
  //     },
  //   );
  // }

  // Calculate the next 1:00 AM to check notifications for expiration
  const next1AM = new Date();
  next1AM.setHours(1, 0, 0, 0); // Set to today's 1:00 AM

  // Calculate the next day's 1:00 AM for expiration comparison
  const nextDay1AM = new Date(next1AM);
  nextDay1AM.setDate(nextDay1AM.getDate() + 1); // Set to next day's 1:00 AM

  // First query all Notification that are nearly to expire in less than a day
  const notificationsToExpire = await prisma.notification.findMany({
    where: {
      expiration: {
        // Check if the expiration is less than or equal to the next day's 1:00 AM
        lte: nextDay1AM,
      },
    },
    select: {
      id: true,
      expiration: true,
      type: true,
      address: true,
      calendarId: true,
      calendarSyncTaskId: true,
      credentialId: true,
      credential: {
        select: {
          id: true,
          type: true,
          token: true,
          refreshToken: true,
          expiresAt: true,
        },
      },
    },
  });

  await Promise.all(
    notificationsToExpire.map(async (notification) => {
      const { credential, credentialId, calendarId, calendarSyncTaskId } =
        notification;
      if (
        credential?.type === "google" &&
        credential?.token &&
        credential?.refreshToken &&
        credential?.expiresAt
      ) {
        // We need to refresh the token
        await GoogleAuth.refreshAccessToken(
          credential.token,
          credential.refreshToken,
          credential.expiresAt,
        );

        const result = await new GoogleNotification().createWatch({
          calendarId,
          calendarSyncTaskId,
          credentialId,
        });

        if (!result) {
          return {
            status: 500,
            message: "Error creating watch",
          };
        }
      }
    }),
  );

  return NextResponse.json(
    {
      message: "Success",
    },
    { status: 200 },
  );
};
