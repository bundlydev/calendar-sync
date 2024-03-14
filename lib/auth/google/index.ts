import { prisma } from "@/lib/prisma";
import { env } from "@/src/env.mjs";
import { google } from "googleapis";

/**
 * This class should be in charge of handling the Google OAuth2 flow.
 * Number 1: It should be able to generate the URL for the user to authenticate with Google.
 * Number 2: It should be able to handle the callback from Google and exchange the code for an access token.
 * Number 3: It should be able to refresh the access token when it expires and store the new token.
 */

export type OAuth2Client = typeof google.auth.OAuth2.prototype;
class GoogleAuth {
  private static clientInstance: OAuth2Client;
  private constructor() {}

  private static init() {
    const client = new google.auth.OAuth2({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      redirectUri:
        env.CALENDAR_SYNC_WEB_URL + "/api/integrations/googlecalendar/callback",
    });
    return client;
  }

  public static getClientInstance() {
    if (!GoogleAuth.clientInstance) {
      GoogleAuth.clientInstance = GoogleAuth.init();
    }
    return GoogleAuth.clientInstance;
  }

  public static userAuthorize(accessToken: string) {
    return GoogleAuth.getClientInstance().setCredentials({
      access_token: accessToken,
    });
  }

  public static getAuthUrl(scope: string[]): string {
    return this.getClientInstance().generateAuthUrl({
      access_type: "offline",
      scope,
      include_granted_scopes: true,
      // Consent should be here otherwise google will not return refresh token
      prompt: "consent",
    });
  }

  public static async getToken(code: string) {
    const { tokens } = await this.getClientInstance().getToken(code);
    return tokens;
  }

  public static async refreshAccessToken(
    accessToken: string,
    refreshToken: string,
    expiresAt: Date,
  ) {
    if (new Date() < expiresAt) {
      GoogleAuth.getClientInstance().setCredentials({
        access_token: accessToken,
      });
      return;
    }

    GoogleAuth.getClientInstance().setCredentials({
      refresh_token: refreshToken,
    });
    try {
      const accessTokenResponse =
        await GoogleAuth.getClientInstance().refreshAccessToken();

      if (!accessTokenResponse.credentials) {
        throw new Error("Failed to refresh access token.");
      }
      await this.saveNewRefreshToken({
        oldRefreshToken: refreshToken,
        credentials: accessTokenResponse.credentials,
      });

      GoogleAuth.getClientInstance().setCredentials({
        access_token: accessTokenResponse.credentials.access_token,
        expiry_date: accessTokenResponse.credentials.expiry_date,
      });
    } catch (error) {
      console.error("Error refreshing access token", error);
      throw new Error("Error refreshing access token");
    }
  }

  private static async saveNewRefreshToken({
    oldRefreshToken,
    credentials,
  }: {
    oldRefreshToken: string;
    credentials: typeof google.auth.OAuth2.prototype.credentials;
  }) {
    // Save the new refresh token to the database
    // Find current token in the database and replace it
    // Save the token to the database
    const { refresh_token, expiry_date } = credentials;

    const currentCredential = await prisma.credential.findFirst({
      where: { type: "calendar", refreshToken: oldRefreshToken },
    });

    if (!currentCredential) {
      throw new Error("No credential found");
    }
    console.log(
      "Updating refresh token",
      { credentials },
      currentCredential.id,
    );
    await prisma.credential.update({
      where: { id: currentCredential.id },
      data: {
        token: credentials.access_token,
        refreshToken: refresh_token,
        expiresAt: expiry_date ? new Date(expiry_date) : null,
      },
    });

    return true;
  }
}

export default GoogleAuth;
