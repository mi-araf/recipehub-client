import { createAuthClient } from "better-auth/react";

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getAuthBaseURL = () => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }

    return process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getAuthBaseURL(),
});