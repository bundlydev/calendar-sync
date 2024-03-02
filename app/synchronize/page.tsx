import React, { Suspense } from "react";

import { AddCalendar } from "./components/add-calendar";
import CalendarList from "./components/calendar-credential-list";

const CalendarSyncPage: React.FC = () => {
  return (
    <div className="flex flex-col rounded-md border p-8">
      <AddCalendar />
      <Suspense fallback={<div>Loading...</div>}>
        <CalendarList />
      </Suspense>
    </div>
  );
};

export default CalendarSyncPage;
