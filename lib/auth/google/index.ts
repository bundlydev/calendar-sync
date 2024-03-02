import { env } from "@/src/env.mjs";
import google from "googleapis";

class GoogleAuth {
  private oauth2Client: google.Auth.AuthClient;

  constructor() {
    const client = new google.auth.OAuth2(
      env.AUTH_GOOGLE_ID,
      env.AUTH_GOOGLE_SECRET,
      env.AUTH_GOOGLE_REDIRECT_URI,
    );
  }
}

export default GoogleAuth;
