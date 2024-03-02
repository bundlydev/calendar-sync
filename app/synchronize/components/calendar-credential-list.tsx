import { prisma } from "@/lib/prisma";
import { auth } from "auth";

const CalendarList = async () => {
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
      <h1>Calendar List</h1>
      <ol>
        {list.map((credential) => (
          <li key={credential.id}>{credential.calendars[0]?.name}</li>
        ))}
      </ol>
    </>
  );
};

export default CalendarList;
