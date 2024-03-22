import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { syncEvents } from "@/lib/events/google/sync";
import type { NextAuthRequest } from "next-auth/lib";

import { ZQueryParamsSync } from "./schemas";

export const GET = auth(async (req: NextAuthRequest) => {
  const session = req.auth;
  if (!session || !session.user?.id) {
    return { status: 401, body: "Unauthorized" };
  }
  const searchParams = req.nextUrl.searchParams;
  const query = Object.fromEntries(searchParams);

  // First get the syncTaskId to sync from the request
  const parse = ZQueryParamsSync.safeParse(query);
  if (!parse.success) {
    return { status: 400, body: "Bad request" };
  }
  const { calendarSyncTaskId } = parse.data;

  const result = await syncEvents(calendarSyncTaskId, session?.user?.id);

  return NextResponse.json({
    ...result,
  });
});
