"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiImage, FiLock, FiMail, FiUserPlus, FiUser } from "react-icons/fi";
import { useAuth } from "@/providers/AuthProvider";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage() {
    const router = useRouter();
    const { checkUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: "",
        password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const validatePassword = () => {
        const password = formData.password;

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            toast.error("Password must include one uppercase letter");
            return false;
        }

        if (!/[a-z]/.test(password)) {
            toast.error("Password must include one lowercase letter");
            return false;
        }

        return true;
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        if (!validatePassword()) return;

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/jwt/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Registration failed");
            }

            await checkUser();

            toast.success("Registration successful", {
                id: "register-success",
            });
            router.replace("/");
            router.refresh();
            // router.push("/");
        } catch (error) {
            toast.error(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const callbackURL = `${window.location.origin}/auth/google/callback?redirect=/`;

            await authClient.signIn.social({
                provider: "google",
                callbackURL,
                errorCallbackURL: `${window.location.origin}/register?oauth=error`,
            });
        } catch (error) {
            toast.error("Google login failed. Please try again.", {
                id: "google-register-error",
            });
        }
    };

    return (
        <section className="rh-section py-10 lg:py-14">
            <div className="grid items-center gap-10 lg:grid-cols-2">
                <div className="rh-home-card rounded-3xl p-8 sm:p-10">
                    <p className="rh-eyebrow mb-3 text-sm font-black uppercase tracking-widest">
                        Join RecipeHub
                    </p>

                    <h1 className="rh-title text-5xl font-black leading-tight tracking-tight">
                        Create your cooking profile.
                    </h1>

                    <p className="rh-muted mt-5 leading-8">
                        Start by sharing up to two recipes for free. Upgrade later to unlock
                        unlimited recipe publishing.
                    </p>
                </div>

                <form
                    onSubmit={handleRegister}
                    className="rh-card rounded-3xl p-6 sm:p-8"
                >
                    <h2 className="rh-title text-3xl font-black">Register</h2>

                    <label className="mt-6 grid gap-2">
                        <span className="font-black">Name</span>
                        <div className="relative">
                            <FiUser className="absolute left-4 top-4 text-slate-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="input input-bordered w-full rounded-2xl pl-11"
                                required
                            />
                        </div>
                    </label>

                    <label className="mt-5 grid gap-2">
                        <span className="font-black">Email</span>
                        <div className="relative">
                            <FiMail className="absolute left-4 top-4 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="input input-bordered w-full rounded-2xl pl-11"
                                required
                            />
                        </div>
                    </label>

                    <label className="mt-5 grid gap-2">
                        <span className="font-black">Image URL</span>
                        <div className="relative">
                            <FiImage className="absolute left-4 top-4 text-slate-400" />
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.png"
                                className="input input-bordered w-full rounded-2xl pl-11"
                            />
                        </div>
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
                                placeholder="Minimum 6 characters"
                                className="input input-bordered w-full rounded-2xl pl-11"
                                required
                            />
                        </div>

                        <span className="rh-muted text-sm font-semibold">
                            Must include uppercase and lowercase letters.
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn mt-7 w-full rounded-full border-0 bg-emerald-600 font-black text-white hover:bg-emerald-700"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            <FiUserPlus size={18} />
                        )}
                        Create Account
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
                        Already have an account?{" "}
                        <Link href="/login" className="font-black text-emerald-700">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}