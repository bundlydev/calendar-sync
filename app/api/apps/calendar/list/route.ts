import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "auth";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth(req, res);

  if (session) {
    // Signed in
    console.log("Session", JSON.stringify(session, null, 2));
    return res.json("This is protected content.");
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};
