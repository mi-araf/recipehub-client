import { createAuthClient } from "better-auth/react";

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const AUTH_URL =
    process.env.NEXT_PUBLIC_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

export const authClient = createAuthClient({
    baseURL: AUTH_URL,
});