import {
  AllDayEventConfigEnum,
  PrivacyCalendarSyncTaskEnum,
} from "@prisma/client";
import z from "zod";

export const ZSyncListSchema = z.object({
  sourceCredentialId: z.string(),
  sourceCredential: z.object({
    id: z.string(),
    externalId: z.string().optional(),
    calendars: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  }),
  sourceExternalId: z.string().optional(),
  toCredentialId: z.string(),
  toCredential: z.object({
    id: z.string(),
    externalId: z.string().optional(),
    calendars: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  }),
  toExternalId: z.string().optional(),
  color: z.string(),
  privacy: z.nativeEnum(PrivacyCalendarSyncTaskEnum),
  allDayEventConfig: z.nativeEnum(AllDayEventConfigEnum),
  enabled: z.boolean(),
});

export const ZGetSyncListSchema = z.union([
  z.array(ZSyncListSchema),
  z.array(z.never()),
]);

export type TGetSyncList = z.infer<typeof ZGetSyncListSchema>;
