"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/providers/AuthProvider";

export default function Providers({ children }) {
    return (
        <AuthProvider>
            {children}

            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2800,
                    style: {
                        borderRadius: "999px",
                        padding: "12px 18px",
                        fontWeight: 600,
                    },
                }}
            />
        </AuthProvider>
    );
}