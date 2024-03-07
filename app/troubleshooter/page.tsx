"use client";

import { useEffect, useState } from "react";

import Calendar from "./components/calendar";

export default function Page() {
  const [data, setData] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/protected");
      const json = await res.json();
      const resEvents = await fetch(`/api/apps/calendar/events/list`);
      const jsonEvents = await resEvents.json();
      setEvents(jsonEvents);
      setData(json);
    })();
  }, []);

  // const { events } = await res.json();
  console.log({ events });
  return (
    <div>
      <h1>Troubleshooter</h1>

      <div>
        <h2>Events</h2>
        {/* {events?.map((event) => (
          <div key={event.id}>{event.summary}</div>
        ))} */}
      </div>
      <div className="h-full w-full">
        <Calendar events={events} />
      </div>
    </div>
  );
}
