"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

interface ICalendarProps {
  events: Array<{ title: string; date: string }>;
}

export default function Calendar(props: ICalendarProps) {
  const { events } = props;
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
}
