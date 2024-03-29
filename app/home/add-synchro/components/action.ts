"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import GoogleAuth from "@/lib/auth/google";
import { syncEvents } from "@/lib/events/google/sync";
import GoogleNotification from "@/lib/notifications/google";
import { prisma } from "@/lib/prisma";
import {
  AllDayEventConfigEnum,
  PrivacyCalendarSyncTaskEnum,
} from "@prisma/client";
import { z } from "zod";

const ZCreateSyncTask = z.object({
  sourceCredentialId: z.string(),
  sourceExternalId: z.string().optional(),
  toCredentialId: z.string(),
  toExternalId: z.string().optional(),
  color: z.string(),
  privacy: z.nativeEnum(PrivacyCalendarSyncTaskEnum),
  allDayEventConfig: z.nativeEnum(AllDayEventConfigEnum),
});

export async function createSyncTask(_formState: any, rawFormData: FormData) {
  // Convert FormData to JSON
  // console.log("rawData", rawData);
  const formData = {};
  for (const [key, value] of rawFormData.entries()) {
    // @TODO: fix ts error
    // @ts-expect-error todo
    formData[key] = value;
  }

  const session = await auth();
  if (!session || !session.user?.id) {
    return {
      status: "error",
      message: "Unauthorized",
    };
  }
  // Parse with zod data
  const syncTask = ZCreateSyncTask.safeParse(formData);
  if (!syncTask.success) {
    return {
      status: "error",
      message: "Invalid data",
      errors: syncTask.error.flatten().fieldErrors,
    };
  }
  const data = syncTask.data;
  // Add the logic to create a sync task here

  // @TODO: move to a service
  try {
    const createdTask = await prisma.calendarSyncTask.create({
      data: {
        userId: session?.user?.id,
        sourceCredentialId: data.sourceCredentialId,
        sourceExternalId: data.sourceExternalId || "",
        toCredentialId: data.toCredentialId,
        toExternalId: data.toExternalId || "",
        color: data.color,
        privacy: data.privacy,
        allDayEventConfig: data.allDayEventConfig,
        enabled: true,
      },
    });

    if (createdTask) {
      // Get user credentials
      const credentials = await prisma.credential.findFirst({
        where: {
          type: "calendar",
          userId: session?.user?.id,
        },
      });

      // Ts safe
      if (
        !credentials ||
        !credentials.token ||
        !credentials.refreshToken ||
        !credentials.expiresAt
      ) {
        return {
          status: "error",
          message: "No credentials found",
        };
      }

      // We need to create a notification
      await GoogleAuth.refreshAccessToken(
        credentials.token,
        credentials.refreshToken,
        credentials.expiresAt,
      );

      // First sync
      await syncEvents(createdTask.id, session.user.id);

      // Then we create the watch so we don't receive a lot of notifications
      await new GoogleNotification().createWatch({
        calendarId: "primary", // @TODO: should use calendarId and not just default,
        credentialId: credentials.id,
        calendarSyncTaskId: createdTask.id,
      });
    } else {
      return {
        status: "error",
        message: "Error creating sync task",
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "Error creating sync task",
    };
  }

  // Validate against zod schema
  revalidatePath("/home/synchro");
  redirect("/home/synchro");
}
