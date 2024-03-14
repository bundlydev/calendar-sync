import z from "zod";

export const ZQueryParamsSync = z
  .object({
    calendarSyncTaskId: z.string(),
  })
  .passthrough();
