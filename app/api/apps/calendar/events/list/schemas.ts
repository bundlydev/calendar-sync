import z from "zod";

const eventSchema = z.object({
  title: z.string(),
  start: z.string(),
  end: z.string(),
  time: z.string(),
  color: z.string(),
});

const ZEventListSchema = z.object({
  status: z.number(),
  events: z.array(eventSchema),
});

export const ZGetEventListSchema = z.union([
  ZEventListSchema,
  z.object({
    events: z.never(),
    status: z.number(),
    message: z.string(),
  }),
]);

export type TGetCalendarEventList = z.infer<typeof ZGetEventListSchema>;
