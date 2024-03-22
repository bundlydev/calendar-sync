import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";

export const AddCalendar = () => {
  return (
    <>
      <Link href="/api/apps/calendar/add" replace>
        <button type="submit" className="self-center">
          <PlusCircleIcon />
        </button>
      </Link>
    </>
  );
};
