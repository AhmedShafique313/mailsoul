import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { pool } from "@/backend/lib/db";

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["https://*.vercel.app", "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      requireLocalEmailVerified: false,
      trustedProviders: ["google", "yahoo"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.modify",
      ],
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "yahoo",
          clientId: process.env.YAHOO_CLIENT_ID as string,
          clientSecret: process.env.YAHOO_CLIENT_SECRET as string,
          discoveryUrl: "https://api.login.yahoo.com/.well-known/openid-configuration",
          scopes: ["openid", "email", "profile"],
          pkce: true,
        },
      ],
    }),
  ],
});
