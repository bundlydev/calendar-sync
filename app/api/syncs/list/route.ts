import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { type NextAuthRequest } from "next-auth/lib";

export const GET = auth(async (req: NextAuthRequest) => {
  const session = req.auth;
  if (!session || !session.user?.id) {
    return NextResponse.json({ data: "Protected data", auth: req.auth });
  }

  const list = await prisma.calendarSyncTask.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      sourceCredentialId: true,
      sourceExternalId: true,
      toCredentialId: true,
      toExternalId: true,
      color: true,
      privacy: true,
      allDayEventConfig: true,
      enabled: true,
      toCredential: {
        select: {
          id: true,
          externalId: true,
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
      },
      sourceCredential: {
        select: {
          id: true,
          externalId: true,
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
      },
    },
  });

  return NextResponse.json(list);
});
