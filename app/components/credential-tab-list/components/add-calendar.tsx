import { PlusCircleIcon } from "lucide-react";

export const AddCalendar = () => {
  return (
    <>
      <form
        method="GET"
        action="/api/apps/calendar/add"
        className="flex justify-center"
      >
        <button type="submit" className="self-center">
          <PlusCircleIcon />
        </button>
      </form>
    </>
  );
};
