import { betterAuth } from "better-auth";
import { pool } from "@/backend/lib/db";

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["https://*.vercel.app", "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
});
