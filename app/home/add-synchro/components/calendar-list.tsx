import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const CalendarList = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  const calendarList = await prisma.credential.findMany({
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
      {calendarList?.map((credential) => {
        return (
          <option value={credential.id} key={credential.id}>
            {credential.calendars[0]?.name}
          </option>
        );
      })}
    </>
  );
};

export default CalendarList;
