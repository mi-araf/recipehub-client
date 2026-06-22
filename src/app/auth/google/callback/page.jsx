"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/providers/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasRun = useRef(false);

    const redirect = searchParams.get("redirect") || "/";
    const { checkUser } = useAuth();

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const syncGoogleUser = async () => {
            try {
                const response = await fetch(`${API_URL}/api/jwt/google-sync`, {
                    method: "POST",
                    credentials: "include",
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Google login sync failed");
                }

                await checkUser();

                toast.success("Google login successful", {
                    id: "google-login-success",
                });

                router.replace(redirect);
            } catch (error) {
                toast.error(error.message || "Google login failed", {
                    id: "google-login-error",
                });

                router.replace("/login");
            }
        };

        syncGoogleUser();
    }, [checkUser, redirect, router]);

    return (
        <section className="rh-section py-14">
            <div className="rh-card rounded-[2rem] p-10 text-center">
                <span className="loading loading-spinner loading-lg text-success" />

                <h1 className="mt-6 text-3xl font-black">
                    Completing Google login...
                </h1>

                <p className="rh-muted mt-3">
                    Please wait while we prepare your RecipeHub account.
                </p>
            </div>
        </section>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense
            fallback={
                <section className="rh-section py-14">
                    <div className="rh-card rounded-[2rem] p-10 text-center">
                        <span className="loading loading-spinner loading-lg text-success" />
                        <h1 className="mt-6 text-3xl font-black">Loading...</h1>
                    </div>
                </section>
            }
        >
            <GoogleCallbackContent />
        </Suspense>
    );
}