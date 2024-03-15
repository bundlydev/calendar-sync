"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import GoogleAuth from "@/lib/auth/google";
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

export async function createSyncTask(rawData: FormData) {
  // Convert FormData to JSON
  const formData = {};
  for (const [key, value] of rawData.entries()) {
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
      errors: JSON.stringify(syncTask.error),
    };
  }
  const data = syncTask.data;
  // Add the logic to create a sync task here

  // @TODO: move to a service
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

    await new GoogleNotification().createWatch({
      calendarId: "primary", // @TODO: should use calendarId and not just default,
      credentialId: credentials.id,
    });
  } else {
    return {
      status: "error",
      message: "Error creating sync task",
    };
  }

  // Validate against zod schema
  revalidatePath("/home/add-synchro");
  return {
    status: "success",
    message: `Sync task created successfully`,
  };
}
