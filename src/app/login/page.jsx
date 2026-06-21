"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "@/providers/AuthProvider";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
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

            toast.success("Login successful");
            router.push(redirect);
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
            toast.error("Google login failed. Check OAuth config.");
        }
    };

    return (
        <section className="rh-section py-10 lg:py-14">
            <div className="grid items-center gap-10 lg:grid-cols-2">
                <div className="rh-home-card rounded-3xl p-8 sm:p-10">
                    <p className="rh-eyebrow mb-3 text-sm font-black uppercase tracking-widest">
                        Welcome back
                    </p>

                    <h1 className="rh-title text-5xl font-black leading-tight tracking-tight">
                        Login to continue cooking.
                    </h1>

                    <p className="rh-muted mt-5 leading-8">
                        Access your dashboard, add recipes, save favorites, report recipes,
                        and purchase premium recipe content.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="rh-card rounded-3xl p-6 sm:p-8">
                    <h2 className="rh-title text-3xl font-black">Login</h2>

                    <label className="mt-6 grid gap-2">
                        <span className="font-black">Email</span>
                        <span className="">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="input input-bordered w-full rounded-2xl pl-11"
                                required
                            />
                        </span>
                    </label>

                    <label className="mt-5 grid gap-2">
                        <span className="font-black">Password</span>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-4 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Your password"
                                className="input input-bordered w-full rounded-2xl pl-11"
                                required
                            />
                        </div>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn mt-7 w-full rounded-full border-0 bg-emerald-600 font-black text-white hover:bg-emerald-700"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            <FiLogIn size={18} />
                        )}
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn mt-3 w-full rounded-full border border-base-300 bg-base-100 font-black"
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    <p className="rh-muted mt-6 text-center font-semibold">
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