import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { list } from "@/lib/events/google/list";
import type { NextAuthRequest } from "next-auth/lib";

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req?.auth?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const result = await list(req.auth.user.id);

  if (result.status !== 200) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json({ events: result.events }, { status: 200 });
});
