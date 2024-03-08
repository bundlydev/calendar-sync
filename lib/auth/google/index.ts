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
  private clientInstance: OAuth2Client;
  constructor() {
    this.clientInstance = this.init();
  }

  private init() {
    const client = new google.auth.OAuth2({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      redirectUri:
        env.CALENDAR_SYNC_WEB_URL + "/api/integrations/googlecalendar/callback",
    });
    return client;
  }

  getClientInstance() {
    if (!this.clientInstance) this.clientInstance = this.init();
    return this.clientInstance;
  }

  public getAuthUrl(scope: string[]): string {
    return this.clientInstance.generateAuthUrl({
      access_type: "offline",
      scope,
      prompt: "consent",
      include_granted_scopes: true,
    });
  }

  public async getToken(code: string) {
    const { tokens } = await this.clientInstance.getToken(code);
    return tokens;
  }

  public async refreshAccessToken(refreshToken: string) {
    this.clientInstance.setCredentials({ refresh_token: refreshToken });
    const accessTokenResponse = await this.clientInstance.refreshAccessToken();
    if (!accessTokenResponse.credentials) {
      throw new Error("Failed to refresh access token.");
    }
    await this.saveNewRefreshToken({
      oldRefreshToken: refreshToken,
      credentials: accessTokenResponse.credentials,
    });

    this.clientInstance.setCredentials(accessTokenResponse.credentials);
  }

  private async saveNewRefreshToken({
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

    await prisma.credential.update({
      where: { id: currentCredential.id },
      data: {
        refreshToken: refresh_token,
        expiresAt: expiry_date ? new Date(expiry_date) : null,
      },
    });

    return true;
  }
}

export default GoogleAuth;
