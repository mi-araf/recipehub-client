"use client";

import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
    return (
        <>
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
        </>
    );
}