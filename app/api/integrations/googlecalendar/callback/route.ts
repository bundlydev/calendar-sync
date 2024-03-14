import { NextResponse } from "next/server";
import { env } from "@/src/env.mjs";
import { prisma } from "@lib/prisma";
import type { Prisma } from "@prisma/client";
import { auth } from "auth";
import { google } from "googleapis";
import type { NextAuthRequest } from "next-auth/lib";
import { z } from "zod";

const calendsyncWebsiteURL = process.env.CALENDAR_SYNC_WEB_URL;
const clientId = env.AUTH_GOOGLE_ID;
const clientSecret = env.AUTH_GOOGLE_SECRET;
const redirectUri = `${calendsyncWebsiteURL}/api/integrations/googlecalendar/callback`;

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

interface GoogleCredentials {
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
  scope?: string;
}

const ZReqAuthSchema = z
  .object({
    auth: z
      .object({
        user: z.object({
          id: z.string().optional(),
          email: z.string(),
        }),
      })
      .passthrough(),
  })
  .passthrough();

const ZReqQuerySchema = z.object({
  nextUrl: z.object({
    searchParams: z.object({
      // function get that returns string
      get: z.function().returns(z.string()),
    }),
  }),
});

const ZCalendarListResponse = z.object({
  data: z
    .object({
      kind: z.string(),
      etag: z.string(),
      nextSyncToken: z.string(),
      items: z.array(
        z.object({
          kind: z.string(),
          etag: z.string(),
          id: z.string(),
          summary: z.string(),
          timeZone: z.string(),
          colorId: z.string(),
          backgroundColor: z.string(),
          foregroundColor: z.string(),
          selected: z.boolean().optional(),
          accessRole: z.string(),
          defaultReminders: z.array(
            z.object({
              method: z.string(),
              minutes: z.number(),
            }),
          ),
          notificationSettings: z
            .object({
              notifications: z.array(
                z.object({
                  type: z.string(),
                  method: z.string(),
                }),
              ),
            })
            .optional(),
          primary: z.boolean().optional(),
          conferenceProperties: z.object({
            allowedConferenceSolutionTypes: z.array(z.string()),
          }),
        }),
      ),
    })
    .passthrough(),
});

export const GET = auth(async (req: NextAuthRequest) => {
  // validate req with authSchema
  const reqAuth = ZReqAuthSchema.safeParse(req);

  if (reqAuth.success === false) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // validate req.query with reqQuerySchema
  const reqQuery = ZReqQuerySchema.safeParse(req);

  if (reqQuery.success === false) {
    return NextResponse.redirect(
      `${calendsyncWebsiteURL}/home?error=access_denied`,
    );
  }

  const code = req.nextUrl.searchParams.get("code") || "";

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  const tokenRaw = await oauth2Client.getToken(code);
  const tokenData = tokenRaw.res?.data as GoogleCredentials;

  const tokenScope = tokenData.scope;
  for (const scope of scopes) {
    if (!tokenScope?.includes(scope)) {
      return NextResponse.redirect(
        `${calendsyncWebsiteURL}/home?error=access_denied`,
      );
    }
  }

  // set oauth2Client credentials with token
  oauth2Client.setCredentials(tokenData);
  // prepare calendar api
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  // get calendar list
  const calendarListResponse = await calendar.calendarList.list();

  // validate calendarListResponse with ZCalendarListResponse
  const calendarList = ZCalendarListResponse.safeParse(calendarListResponse);

  // print paths of error
  if (calendarList.success === false) {
    return NextResponse.redirect(
      `${calendsyncWebsiteURL}/home?error=calendar_list_failed`,
    );
  }

  // save process

  // First save credential to the database
  // What user?
  let user: {
    id?: string | null;
    email: string | null;
  } | null = reqAuth.data.auth.user;

  if (!user?.email) {
    const userFound = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        email: true,
      },
    });
    user = userFound;
  }
  if (!user?.id) {
    return NextResponse.redirect(
      `${calendsyncWebsiteURL}/home?error=user_not_found`,
    );
  }

  // save credentials to the database
  // get providerId = google
  const provider = await prisma.provider.findFirst({
    where: {
      name: "google_calendar",
    },
    select: {
      id: true,
    },
  });

  if (!provider) {
    return NextResponse.redirect(
      `${calendsyncWebsiteURL}/home?error=provider_not_found`,
    );
  }

  // save calendars to the database
  await prisma.calendar.createMany({
    data: [],
  });

  if (!provider) {
    return NextResponse.redirect(
      `${calendsyncWebsiteURL}/home?error=provider_not_found`,
    );
  }

  let credential: Prisma.CredentialGetPayload<{
    select: {
      id: true;
    };
  }>;

  const findCredential = await prisma.credential.findFirst({
    where: {
      userId: user.id,
      providerId: provider.id,
      type: "calendar",
      externalId: calendarList.data.data.etag,
    },
    select: {
      id: true,
    },
  });

  if (!findCredential) {
    credential = await prisma.credential.create({
      data: {
        userId: user.id,
        providerId: provider.id,
        type: "calendar",
        externalId: calendarList.data.data.etag || "",
        ...(tokenData.access_token && { token: tokenData.access_token }),
        ...(tokenData.refresh_token && {
          refreshToken: tokenData.refresh_token,
        }),
        ...(tokenData.expiry_date && {
          expiresAt: new Date(tokenData.expiry_date),
        }),
      },
    });
  } else {
    credential = findCredential;
  }

  // save calendars to the database
  await prisma.calendar.createMany({
    data: calendarList.data.data.items.map((calendar) => {
      return {
        externalId: calendar.id,
        name: calendar.summary,
        backgroundColor: calendar.backgroundColor,
        foregroundColor: calendar.foregroundColor,
        providerId: provider.id,
        credentialId: credential.id,
        etag: calendar.etag,
        timeZone: calendar.timeZone,
        accessRole: calendar.accessRole,
        selected: !!calendar.selected,
        primary: !!calendar.primary,
        kind: calendar.kind,
        colorId: calendar.colorId,
      };
    }),
  });

  return NextResponse.redirect(`${calendsyncWebsiteURL}/home?success=true`);
});

// calendarList {
//     config: {
//       url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
//       method: 'GET',
//       userAgentDirectives: [ [Object] ],
//       paramsSerializer: [Function (anonymous)],
//       headers: {
//         'x-goog-api-client': 'gdcl/7.0.1 gl-node/20.10.0',
//         'Accept-Encoding': 'gzip',
//         'User-Agent': 'google-api-nodejs-client/7.0.1 (gzip)',
//         Authorization: 'Bearer ya29.a0AfB_byDN2aJLNScfjYjfKJSXVTz4L2v05ctlhh19m5uus1RoxLhwj6RAP-8VxnQX6NdViz6Ca3qwdgRvRxH9m2rVxnDCi80yAYg4gY2nyLr4Pxur-MiDgIeaon1W8MrmoloWwEBGD9Vv_IIj9li88H9S_5M-0YNt1p1iaCgYKAYoSARESFQHGX2MiSN8kejT48g1CKtxg18Nejg0171'
//       },
//       params: {},
//       validateStatus: [Function (anonymous)],
//       retry: true,
//       responseType: 'unknown',
//       errorRedactor: [Function: defaultErrorRedactor]
//     },
//     data: {
//       kind: 'calendar#calendarList',
//       etag: '"p33cbfp5vjufo80o"',
//       nextSyncToken: 'CNi35L-fn4QDEhFhbGFubm5jQGdtYWlsLmNvbQ==',
//       items: [ [Object], [Object], [Object], [Object], [Object] ]
//     },
//     headers: {
//       'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
//       'cache-control': 'private, max-age=0, must-revalidate, no-transform',
//       'content-encoding': 'gzip',
//       'content-type': 'application/json; charset=UTF-8',
//       date: 'Mon, 12 Feb 2024 06:36:34 GMT',
//       expires: 'Mon, 12 Feb 2024 06:36:34 GMT',
//       server: 'ESF',
//       'transfer-encoding': 'chunked',
//       vary: 'Origin, X-Origin, Referer',
//       'x-content-type-options': 'nosniff',
//       'x-frame-options': 'SAMEORIGIN',
//       'x-xss-protection': '0'
//     },
//     status: 200,
//     statusText: 'OK',
//     request: {
//       responseURL: 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
//     }
//   }
//   primaryCalendar {
//     kind: 'calendar#calendarListEntry',
//     etag: '"1669848562922000"',
//     id: 'alannnc@gmail.com',
//     summary: 'alannnc@gmail.com',
//     timeZone: 'America/Mazatlan',
//     colorId: '15',
//     backgroundColor: '#9fc6e7',
//     foregroundColor: '#000000',
//     selected: true,
//     accessRole: 'owner',
//     defaultReminders: [
//       { method: 'email', minutes: 10 },
//       { method: 'popup', minutes: 30 }
//     ],
//     notificationSettings: { notifications: [ [Object], [Object], [Object], [Object] ] },
//     primary: true,
//     conferenceProperties: { allowedConferenceSolutionTypes: [ 'hangoutsMeet' ] }
//   }
//   primaryCalendarId alannnc@gmail.com
