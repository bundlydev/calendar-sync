import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "auth";
import type { NextAuthRequest } from "next-auth/lib";

export const GET = auth(async (req: NextAuthRequest) => {
  if (req.auth && !req.auth.user?.id) {
    return Response.json({ data: "Protected data", auth: req.auth });
  }

  const list = await prisma.credential.findMany({
    where: {
      userId: req.auth?.user?.id,
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

  return NextResponse.json(list);
});
