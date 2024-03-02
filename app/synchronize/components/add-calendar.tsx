import { PlusCircleIcon } from "lucide-react";

export const AddCalendar = () => {
  return (
    <>
      <form method="GET" action="/api/apps/calendar/add">
        <button type="submit">
          Add Calendar <PlusCircleIcon />
        </button>
      </form>
    </>
  );
};
