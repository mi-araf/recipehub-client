"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiLock, FiLogIn, FiMail } from "react-icons/fi";

import { useAuth } from "@/providers/AuthProvider";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirect = searchParams.get("redirect") || "/";
    const { checkUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/jwt/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Login failed");
            }

            await checkUser();

            toast.success("Login successful", {
                id: "login-success",
            });

            router.replace(redirect);
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const callbackURL = `${window.location.origin}/auth/google/callback?redirect=${encodeURIComponent(
                redirect
            )}`;

            await authClient.signIn.social({
                provider: "google",
                callbackURL,
                errorCallbackURL: `${window.location.origin}/login?oauth=error`,
            });
        } catch (error) {
            console.error("Google login error:", error);

            toast.error("Google login failed. Check OAuth config.", {
                id: "google-login-error",
            });
        }
    };

    return (
        <section className="rh-section py-12 lg:py-20">
            <div className="grid items-center gap-8 lg:grid-cols-2">
                <div className="recipehub-page-card rounded-[2rem] p-8 lg:p-12">
                    <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                        Welcome Back
                    </p>

                    <h1 className="mt-4 text-4xl font-black leading-tight lg:text-6xl">
                        Login to continue cooking.
                    </h1>

                    <p className="recipehub-muted-text mt-6 text-lg leading-8">
                        Access your dashboard, add recipes, save favorites, report recipes,
                        and purchase premium recipe content.
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="rh-card grid gap-5 rounded-[2rem] p-6 lg:p-10"
                >
                    <h2 className="text-3xl font-black">Login</h2>

                    <label className="form-control">
                        <span className="label-text mb-2 font-black">Email</span>

                        <div className="relative">
                            <FiMail className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 opacity-50" />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="input input-bordered w-full rounded-full pl-12"
                                required
                            />
                        </div>
                    </label>

                    <label className="form-control">
                        <span className="label-text mb-2 font-black">Password</span>

                        <div className="relative">
                            <FiLock className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 opacity-50" />

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Your password"
                                className="input input-bordered w-full rounded-full pl-12"
                                required
                            />
                        </div>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn rounded-full border-0 bg-emerald-600 font-black text-white hover:bg-emerald-700"
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />
                                Logging in...
                            </>
                        ) : (
                            <>
                                <FiLogIn />
                                Login
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn rounded-full border border-base-300 bg-base-100 font-black text-base-content hover:bg-base-200"
                    >
                        <FcGoogle size={22} />
                        Continue with Google
                    </button>

                    <p className="text-center font-medium opacity-70">
                        New here?{" "}
                        <Link href="/register" className="font-black text-emerald-700">
                            Create account
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <section className="rh-section py-12 lg:py-20">
                    <div className="rh-card rounded-[2rem] p-10 text-center">
                        <span className="loading loading-spinner loading-lg text-success" />
                        <h1 className="mt-5 text-2xl font-black">Loading login...</h1>
                    </div>
                </section>
            }
        >
            <LoginContent />
        </Suspense>
    );
}