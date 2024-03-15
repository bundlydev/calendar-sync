"use client";

import { Suspense, useEffect, useState } from "react";
import {
  ZGetEventListSchema,
  type TGetCalendarEventList,
} from "@/app/api/apps/calendar/events/list/schemas";
import Header from "@/app/components/header";

import Calendar from "./components/calendar";

export default function Page() {
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
    <div className="container h-screen px-8">
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async react component */}
        <Header />
      </Suspense>
      <div className="mt-4">
        {/* @TODO: events missing date from backend? */}
        <Calendar events={events} />
      </div>
    </div>
  );
}
