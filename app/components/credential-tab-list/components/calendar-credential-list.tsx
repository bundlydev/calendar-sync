import { prisma } from "@/lib/prisma";
import { auth } from "auth";

const CalendarsTabList = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const list = await prisma.credential.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      calendars: {
        select: {
          id: true,
          name: true,
        },
        where: {
          primary: true,
        },
      },
    },
  });

  return (
    <>
      {list.map((credential, index) => {
        const offset = index + 1;
        return (
          <button
            type="button"
            className="inline-flex items-center gap-x-2 rounded-lg bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-500 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 hs-tab-active:dark:text-white"
            id={`pills-with-brand-color-item-${offset}`}
            data-hs-tab={`#pills-with-brand-color-${offset}`}
            aria-controls={`pills-with-brand-color-${offset}`}
            role="tab"
            key={credential.id}
          >
            {credential.calendars[0]?.name}
          </button>
        );
      })}
    </>
  );
};

export default CalendarsTabList;
