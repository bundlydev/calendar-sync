"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
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

  await prisma.calendarSyncTask.create({
    data: {
      userId: session?.user?.id,
      sourceCredentialId: data.sourceCredentialId,
      // sourceCredential: {
      //   connect: { id: data.sourceCredentialId },
      // },
      sourceExternalId: data.sourceExternalId || "",
      toCredentialId: data.toCredentialId,
      // toCredential: {
      //   connect: { id: data.toCredentialId },
      // },
      toExternalId: data.toExternalId || "",
      color: data.color,
      privacy: data.privacy,
      allDayEventConfig: data.allDayEventConfig,
      enabled: true,
    },
  });

  // Validate against zod schema
  revalidatePath("/home/add-synchro");
  return {
    status: "success",
    message: `Sync task created successfully`,
  };
}
