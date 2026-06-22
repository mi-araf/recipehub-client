"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiAward,
    FiLogOut,
    FiSave,
    FiShield,
    FiUser,
    FiX,
} from "react-icons/fi";

import { apiRequest, getInitial } from "@/lib/dashboardApi";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminProfilePage() {
    const { user, checkUser, logout } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({ name: "", image: "" });
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                image: user.image || "",
            });
        }
    }, [user]);

    const isAdmin = user?.role === "admin";
    const isPremium = Boolean(user?.isPremium);
    const profileBadge = isAdmin ? "Admin" : isPremium ? "Premium Chef" : "Free Chef";

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

            await apiRequest("/api/users/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            await checkUser();

            toast.success("Admin profile updated", {
                id: "admin-profile-updated",
            });
        } catch (error) {
            toast.error(error.message || "Could not update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            await logout();

            toast.success("Logged out successfully", {
                id: "logout-success",
            });

            setLogoutModalOpen(false);
            router.push("/login");
            router.refresh();
        } catch {
            toast.error("Could not logout. Please try again.");
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Admin Profile
                </p>

                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Manage your admin identity.
                </h1>

                <p className="recipehub-muted-text mt-3">
                    Update your admin name and profile image from the admin dashboard.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="rh-card rounded-[2rem] p-6 text-center">
                    <div className="mx-auto grid size-32 place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 to-emerald-600 text-5xl font-black text-white shadow-xl shadow-emerald-500/20">
                        {formData.image ? (
                            <img
                                src={formData.image}
                                alt={formData.name || "Admin"}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            getInitial(formData.name || user?.email || "A")
                        )}
                    </div>

                    <h2 className="mt-5 text-2xl font-black">
                        {formData.name || "Admin"}
                    </h2>

                    <p className="rh-muted mt-1">{user?.email}</p>

                    <div
                        className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${isAdmin
                                ? "bg-slate-950 text-white"
                                : isPremium
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-base-200 text-base-content/70"
                            }`}
                    >
                        {isAdmin ? <FiShield /> : isPremium ? <FiAward /> : <FiUser />}
                        {profileBadge}
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rh-card grid gap-5 rounded-[2rem] p-6"
                >
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
                        className="btn rounded-full border-0 bg-slate-950 px-8 font-black text-white hover:bg-slate-800"
                    >
                        {saving ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave />
                                Save Admin Profile
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="rh-card overflow-hidden rounded-[2rem] border border-red-200/70 p-0">
                <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 p-6 dark:from-red-950/30 dark:via-rose-950/20 dark:to-orange-950/20">
                    <div className="absolute -right-10 -top-10 size-32 rounded-full bg-red-400/10" />
                    <div className="absolute -bottom-12 left-10 size-40 rounded-full bg-orange-400/10" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-600 shadow-lg shadow-red-500/10">
                                <FiShield size={24} />
                            </span>

                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-500">
                                    Admin Session
                                </p>

                                <h2 className="mt-1 text-2xl font-black">
                                    Leave admin mode safely?
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm font-medium text-base-content/60">
                                    Logout securely from RecipeHub. Your admin access and account
                                    data remain protected.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setLogoutModalOpen(true)}
                            disabled={loggingOut}
                            className="btn h-14 rounded-2xl border-0 bg-red-500 px-8 text-base font-black text-white shadow-xl shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-600 disabled:opacity-70"
                        >
                            <FiLogOut size={20} />
                            Logout Now
                        </button>
                    </div>
                </div>
            </div>

            {logoutModalOpen && (
                <div className="fixed inset-0 z-[999] grid place-items-center bg-slate-950/60 px-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-red-200/40 bg-base-100 shadow-2xl shadow-red-950/20">
                        <button
                            type="button"
                            onClick={() => setLogoutModalOpen(false)}
                            disabled={loggingOut}
                            className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-base-200 text-base-content/70 transition hover:bg-red-100 hover:text-red-600"
                            aria-label="Close logout modal"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="relative p-7 text-center">
                            <div className="mx-auto grid size-20 place-items-center rounded-[1.5rem] bg-red-100 text-red-600 shadow-xl shadow-red-500/10">
                                <FiLogOut size={34} />
                            </div>

                            <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-red-500">
                                Confirm Logout
                            </p>

                            <h2 className="mt-2 text-3xl font-black">
                                Leaving admin dashboard?
                            </h2>

                            <p className="mx-auto mt-3 max-w-sm text-sm font-medium leading-6 text-base-content/60">
                                You will be signed out from this device and redirected to login.
                            </p>

                            <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => setLogoutModalOpen(false)}
                                    disabled={loggingOut}
                                    className="btn h-13 rounded-2xl border border-base-300 bg-base-100 font-black text-base-content hover:bg-base-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="btn h-13 rounded-2xl border-0 bg-red-500 font-black text-white shadow-xl shadow-red-500/20 hover:bg-red-600 disabled:opacity-70"
                                >
                                    {loggingOut ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm" />
                                            Logging out...
                                        </>
                                    ) : (
                                        <>
                                            <FiLogOut size={18} />
                                            Yes, Logout
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}