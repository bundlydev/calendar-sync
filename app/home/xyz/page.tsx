"use client";

import { Suspense, useEffect, useState } from "react";
import Header from "@/app/components/header";

import Calendar from "./components/calendar";

export default function Page() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    (async () => {
      const resEvents = await fetch(`/api/apps/calendar/events/list`);
      const jsonEvents = await resEvents.json();
      setEvents(jsonEvents);
    })();
  }, []);

  return (
    <div className="container h-screen px-8">
      {/* <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense> */}
      <div className="mt-4">
        <Calendar events={events} />
      </div>
    </div>
  );
}
