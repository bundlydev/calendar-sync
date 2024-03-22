import z from "zod";

const calendarSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const credentialSchema = z.object({
  id: z.string(),
  calendars: z.array(calendarSchema),
});

export const ZGetCalendarListSchema = z.union([
  z.array(credentialSchema),
  z.array(z.never()),
]);

export type TGetCalendarList = z.infer<typeof ZGetCalendarListSchema>;
