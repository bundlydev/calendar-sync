"use client";

import { useEffect, useState } from "react";
import {
  ZGetEventListSchema,
  type TGetCalendarEventList,
} from "@/app/api/apps/calendar/events/list/schemas";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

export const Calendar = () => {
  const [events, setEvents] = useState<
    TGetCalendarEventList["events"] | never[]
  >([]);
  useEffect(() => {
    void (async () => {
      const resEvents = await fetch(`/api/apps/calendar/events/list`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const jsonRes = await resEvents.json();
      const parsed = ZGetEventListSchema.safeParse(jsonRes);
      if (!parsed.success) {
        return;
      }
      setEvents(parsed.data.events);
    })();
  }, []);

  return (
    <div className="rounded-2xl p-2 dark:bg-slate-400">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
};
