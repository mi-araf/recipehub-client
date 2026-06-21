"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiAward, FiSave, FiUser, FiLogOut, FiShield } from "react-icons/fi";

import { apiRequest, getInitial } from "@/lib/dashboardApi";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfilePage() {
    const { user, checkUser, logout } = useAuth();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const [formData, setFormData] = useState({ name: "", image: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                image: user.image || "",
            });
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

            await apiRequest("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            await checkUser();
            toast.success("Profile updated");
        } catch (error) {
            toast.error(error.message || "Could not update profile");
        } finally {
            setSaving(false);
        }
    };

    const isPremium = Boolean(user?.isPremium);

    const handleLogout = async () => {
        const confirmed = window.confirm("Are you sure you want to logout?");

        if (!confirmed) return;

        try {
            setLoggingOut(true);

            await logout();

            toast.success("Logged out successfully");
            router.push("/login");
            router.refresh();
        } catch (error) {
            toast.error("Could not logout. Please try again.");
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Profile
                </p>
                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Update your chef identity.
                </h1>
                <p className="recipehub-muted-text mt-3">
                    Update your name and image. Premium users show a special badge.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="rh-card rounded-[2rem] p-6 text-center">
                    <div className="mx-auto grid size-32 place-items-center overflow-hidden rounded-[2rem] bg-linear-to-br from-emerald-500 to-amber-400 text-5xl font-black text-white shadow-xl shadow-emerald-500/20">
                        {formData.image ? (
                            <img
                                src={formData.image}
                                alt={formData.name || "Profile"}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            getInitial(formData.name || user?.email || "User")
                        )}
                    </div>

                    <h2 className="mt-5 text-2xl font-black">{formData.name || "User"}</h2>
                    <p className="rh-muted mt-1">{user?.email}</p>

                    <div
                        className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${isPremium
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-base-200 text-base-content/70"
                            }`}
                    >
                        {isPremium ? <FiAward /> : <FiUser />}
                        {isPremium ? "Premium Chef" : "Free Chef"}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="rh-card grid gap-5 rounded-[2rem] p-6">
                    <label className="form-control">
                        <span className="label-text mb-2 font-black">Name</span>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input input-bordered rounded-2xl"
                            required
                        />
                    </label>

                    <label className="form-control">
                        <span className="label-text mb-2 font-black">Image URL</span>
                        <input
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="input input-bordered rounded-2xl"
                        />
                    </label>

                    <label className="form-control">
                        <span className="label-text mb-2 font-black">Email</span>
                        <input
                            value={user?.email || ""}
                            className="input input-bordered rounded-2xl opacity-70"
                            disabled
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={saving}
                        className="btn rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700"
                    >
                        {saving ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave />
                                Save Profile
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="rh-card overflow-hidden rounded-[2rem] border border-red-200/70 p-0">
                <div className="relative overflow-hidden bg-linear-to-br from-red-50 via-rose-50 to-orange-50 p-6 dark:from-red-950/30 dark:via-rose-950/20 dark:to-orange-950/20">
                    <div className="absolute -right-10 -top-10 size-32 rounded-full bg-red-400/10" />
                    <div className="absolute -bottom-12 left-10 size-40 rounded-full bg-orange-400/10" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-600 shadow-lg shadow-red-500/10 dark:bg-red-950/50 dark:text-red-300">
                                <FiShield size={24} />
                            </span>

                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-500">
                                    Account Session
                                </p>

                                <h2 className="mt-1 text-2xl font-black">
                                    Ready to leave the kitchen?
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm font-medium text-base-content/60">
                                    Logout safely from RecipeHub. Your saved recipes, profile, favorites,
                                    and dashboard data will stay protected.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="btn h-14 rounded-2xl border-0 bg-red-500 px-8 text-base font-black text-white shadow-xl shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-600 disabled:opacity-70"
                        >
                            {loggingOut ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <FiLogOut size={20} />
                                    Logout Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
